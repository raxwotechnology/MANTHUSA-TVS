"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
const crypto_1 = require("crypto");
const common_2 = require("@nestjs/common");
let AuthService = class AuthService {
    userModel;
    jwtService;
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
    }
    async validateUser(email, pass) {
        const user = await this.userModel.findOne({ email }).populate('role');
        if (user && await bcrypt.compare(pass, user.passwordHash)) {
            const { passwordHash, ...result } = user.toObject();
            return result;
        }
        return null;
    }
    digest(token) { return (0, crypto_1.createHash)('sha256').update(token).digest('hex'); }
    async sendEmail(to, subject, text) {
        const apiKey = process.env.RESEND_API_KEY;
        const from = process.env.EMAIL_FROM;
        const appUrl = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
        if (!apiKey || !from)
            return false;
        const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from, to: [to], subject, text: `${text}\n\n${appUrl}` }) });
        if (!response.ok)
            throw new common_2.BadRequestException('Email delivery failed. Please try again later.');
        return true;
    }
    async requestPasswordReset(emailInput) {
        const email = String(emailInput || '').trim().toLowerCase();
        if (!email)
            return { message: 'If the account exists and email delivery is configured, reset instructions will be sent.' };
        const user = await this.userModel.findOne({ email, isActive: { $ne: false } }).exec();
        if (user) {
            const token = (0, crypto_1.randomBytes)(32).toString('hex');
            user.passwordResetTokenHash = this.digest(token);
            user.passwordResetExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
            await user.save();
            const delivered = await this.sendEmail(email, 'Reset your SalesPlus password', `Use this one-time token within 30 minutes to reset your password: ${token}`);
            if (!delivered) {
                user.passwordResetTokenHash = undefined;
                user.passwordResetExpiresAt = undefined;
                await user.save();
            }
        }
        return { message: 'If the account exists and email delivery is configured, reset instructions will be sent.' };
    }
    async resetPassword(tokenInput, newPassword) {
        const token = String(tokenInput || '');
        if (token.length !== 64 || !newPassword || newPassword.length < 10)
            throw new common_2.BadRequestException('A valid reset token and password of at least 10 characters are required.');
        const user = await this.userModel.findOne({ passwordResetTokenHash: this.digest(token), passwordResetExpiresAt: { $gt: new Date() }, isActive: { $ne: false } }).exec();
        if (!user)
            throw new common_2.BadRequestException('Reset token is invalid or expired. Request a new password reset.');
        user.passwordHash = await bcrypt.hash(newPassword, 12);
        user.passwordResetTokenHash = undefined;
        user.passwordResetExpiresAt = undefined;
        await user.save();
        return { message: 'Password updated. You can now sign in.' };
    }
    async requestEmailVerification(emailInput) {
        const email = String(emailInput || '').trim().toLowerCase();
        const user = await this.userModel.findOne({ email, emailVerified: false, isActive: { $ne: false } }).exec();
        if (user) {
            const token = (0, crypto_1.randomBytes)(32).toString('hex');
            user.emailVerificationTokenHash = this.digest(token);
            user.emailVerificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
            await user.save();
            const delivered = await this.sendEmail(email, 'Verify your SalesPlus email', `Use this one-time token within 24 hours to verify your email: ${token}`);
            if (!delivered) {
                user.emailVerificationTokenHash = undefined;
                user.emailVerificationExpiresAt = undefined;
                await user.save();
            }
        }
        return { message: 'If email verification is required for this account and delivery is configured, instructions will be sent.' };
    }
    async verifyEmail(tokenInput) {
        const token = String(tokenInput || '');
        if (token.length !== 64)
            throw new common_2.BadRequestException('Verification token is invalid or expired.');
        const user = await this.userModel.findOne({ emailVerificationTokenHash: this.digest(token), emailVerificationExpiresAt: { $gt: new Date() }, isActive: { $ne: false } }).exec();
        if (!user)
            throw new common_2.BadRequestException('Verification token is invalid or expired.');
        user.emailVerified = true;
        user.emailVerificationTokenHash = undefined;
        user.emailVerificationExpiresAt = undefined;
        await user.save();
        return { message: 'Email verified.' };
    }
    async setupMfa(userId) {
        const user = await this.userModel.findById(userId).exec();
        if (!user)
            throw new common_2.BadRequestException('User not found.');
        const secret = (0, crypto_1.randomBytes)(20).toString('hex').slice(0, 16).toUpperCase();
        const backupCodes = Array.from({ length: 6 }, () => (0, crypto_1.randomBytes)(4).toString('hex').toUpperCase());
        user.mfaSecret = secret;
        await user.save();
        const otpAuthUrl = `otpauth://totp/SalesPlus:${encodeURIComponent(user.email)}?secret=${secret}&issuer=SalesPlus`;
        return { secret, otpAuthUrl, backupCodes };
    }
    async verifyMfaToken(userId, code) {
        const user = await this.userModel.findById(userId).exec();
        if (!user || !user.mfaSecret)
            throw new common_2.BadRequestException('MFA not configured.');
        const codeClean = String(code || '').trim();
        const isBackupCode = user.mfaBackupCodes && user.mfaBackupCodes.includes(codeClean);
        if (isBackupCode) {
            user.mfaBackupCodes = user.mfaBackupCodes.filter((c) => c !== codeClean);
            await user.save();
            return true;
        }
        const window = Math.floor(Date.now() / 30000);
        const expected = (0, crypto_1.createHash)('sha256').update(`${user.mfaSecret}:${window}`).digest('hex');
        const expectedNum = (parseInt(expected.substring(0, 8), 16) % 1000000).toString().padStart(6, '0');
        const expectedPrev = (parseInt((0, crypto_1.createHash)('sha256').update(`${user.mfaSecret}:${window - 1}`).digest('hex').substring(0, 8), 16) % 1000000).toString().padStart(6, '0');
        if (codeClean === expectedNum || codeClean === expectedPrev) {
            return true;
        }
        return false;
    }
    async enableMfa(userId, code, backupCodes) {
        const isValid = await this.verifyMfaToken(userId, code);
        if (!isValid)
            throw new common_2.BadRequestException('Invalid MFA verification code.');
        const user = await this.userModel.findById(userId).exec();
        user.mfaEnabled = true;
        user.mfaBackupCodes = backupCodes || [];
        await user.save();
        return { message: 'MFA enabled successfully.' };
    }
    async disableMfa(userId, code) {
        const isValid = await this.verifyMfaToken(userId, code);
        if (!isValid)
            throw new common_2.BadRequestException('Invalid MFA verification code.');
        const user = await this.userModel.findById(userId).exec();
        user.mfaEnabled = false;
        user.mfaSecret = undefined;
        user.mfaBackupCodes = [];
        await user.save();
        return { message: 'MFA disabled.' };
    }
    async login(user) {
        if (user.mfaEnabled) {
            return {
                mfaRequired: true,
                userId: user._id,
                email: user.email,
                message: 'MFA verification required.'
            };
        }
        const payload = { email: user.email, sub: user._id, role: user.role?.name, roleId: user.role?._id };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role?.name,
                mfaEnabled: !!user.mfaEnabled
            }
        };
    }
    async completeMfaLogin(userId, code) {
        const user = await this.userModel.findById(userId).populate('role').exec();
        if (!user || !user.mfaEnabled)
            throw new common_2.BadRequestException('User invalid or MFA not enabled.');
        const isValid = await this.verifyMfaToken(userId, code);
        if (!isValid)
            throw new common_2.BadRequestException('Invalid MFA code.');
        const payload = { email: user.email, sub: user._id, role: user.role?.name, roleId: user.role?._id };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role?.name,
                mfaEnabled: true
            }
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
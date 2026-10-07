"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const public_decorator_1 = require("./public.decorator");
let AuthController = class AuthController {
    authService;
    attempts = new Map();
    recoveryAttempts = new Map();
    mfaAttempts = new Map();
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginDto, request) {
        const key = request.ip || request.socket?.remoteAddress || 'unknown';
        const now = Date.now();
        const recent = (this.attempts.get(key) || []).filter((timestamp) => now - timestamp < 60_000);
        if (recent.length >= 10)
            throw new common_1.HttpException('Too many login attempts. Try again in one minute.', common_1.HttpStatus.TOO_MANY_REQUESTS);
        recent.push(now);
        this.attempts.set(key, recent);
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user);
    }
    async forgotPassword(body, request) {
        this.limitRecovery(request.ip || 'unknown');
        return this.authService.requestPasswordReset(body.email);
    }
    resetPassword(body) { return this.authService.resetPassword(body.token, body.password); }
    async requestEmailVerification(body, request) {
        this.limitRecovery(request.ip || 'unknown');
        return this.authService.requestEmailVerification(body.email);
    }
    verifyEmail(body) { return this.authService.verifyEmail(body.token); }
    verifyMfaLogin(body, request) {
        this.limitMfa(request.ip || 'unknown', body.userId);
        return this.authService.completeMfaLogin(body.userId, body.code);
    }
    setupMfa(req) {
        return this.authService.setupMfa(req.user.userId || req.user.id || req.user.sub);
    }
    enableMfa(req, body) {
        return this.authService.enableMfa(req.user.userId || req.user.id || req.user.sub, body.code, body.backupCodes);
    }
    disableMfa(req, body) {
        return this.authService.disableMfa(req.user.userId || req.user.id || req.user.sub, body.code);
    }
    limitRecovery(ip) {
        const now = Date.now();
        const attempts = (this.recoveryAttempts.get(ip) || []).filter(timestamp => now - timestamp < 60_000);
        if (attempts.length >= 5)
            throw new common_1.HttpException('Too many account recovery requests. Try again in one minute.', common_1.HttpStatus.TOO_MANY_REQUESTS);
        attempts.push(now);
        this.recoveryAttempts.set(ip, attempts);
    }
    limitMfa(ip, userId) {
        const key = `${ip}:${String(userId || '')}`;
        const now = Date.now();
        const attempts = (this.mfaAttempts.get(key) || []).filter((timestamp) => now - timestamp < 60_000);
        if (attempts.length >= 10) {
            throw new common_1.HttpException('Too many MFA attempts. Try again in one minute.', common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        attempts.push(now);
        this.mfaAttempts.set(key, attempts);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('request-email-verification'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "requestEmailVerification", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('verify-email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('mfa/login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verifyMfaLogin", null);
__decorate([
    (0, common_1.Post)('mfa/setup'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "setupMfa", null);
__decorate([
    (0, common_1.Post)('mfa/enable'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "enableMfa", null);
__decorate([
    (0, common_1.Post)('mfa/disable'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "disableMfa", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map
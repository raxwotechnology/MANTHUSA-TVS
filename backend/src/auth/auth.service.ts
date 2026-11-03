import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'crypto';
import { BadRequestException, ConflictException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<any>,
    @InjectModel('Role') private roleModel: Model<any>,
    @InjectModel('Customer') private customerModel: Model<any>,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userModel.findOne({ email: String(email || '').trim().toLowerCase(), isActive: { $ne: false } }).populate('role');
    if (user && await bcrypt.compare(pass, user.passwordHash)) {
      const { passwordHash, ...result } = user.toObject();
      if (!result.customerId) {
        const cust = await this.customerModel.findOne({ $or: [{ userId: result._id }, { email: result.email }] }).exec();
        if (cust) result.customerId = cust._id;
      }
      return result;
    }
    return null;
  }

  async registerCustomer(input: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address?: string;
    city?: string;
  }) {
    const name = String(input.name || '').trim();
    const email = String(input.email || '').trim().toLowerCase();
    const phone = String(input.phone || '').trim();
    const password = String(input.password || '');

    if (name.length < 2) throw new BadRequestException('Full name must contain at least 2 characters.');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new BadRequestException('A valid email address is required.');
    if (phone.length < 7) throw new BadRequestException('A valid phone number is required.');
    if (password.length < 8) throw new BadRequestException('Password must contain at least 8 characters.');
    if (await this.userModel.exists({ email })) throw new ConflictException('An account with this email already exists.');

    const role = await this.roleModel.findOne({ name: 'Customer' }).exec();
    if (!role) throw new BadRequestException('Customer role is not configured. Please run the database seed first.');

    const customer = await new this.customerModel({
      fullName: name,
      email,
      phone,
      address: String(input.address || '').trim() || undefined,
      city: String(input.city || '').trim() || undefined,
      customerType: 'Individual',
    }).save();

    try {
      const user = await new this.userModel({
        name,
        email,
        passwordHash: await bcrypt.hash(password, 12),
        role: role._id,
        customerId: customer._id,
        isActive: true,
        emailVerified: false,
      }).save();
      customer.userId = user._id;
      await customer.save();
      return this.login({ _id: user._id, name, email, role: { _id: role._id, name: 'Customer' }, mfaEnabled: false, customerId: customer._id });
    } catch (error) {
      await this.customerModel.findByIdAndDelete(customer._id).exec();
      if ((error as any)?.code === 11000) throw new ConflictException('An account with this email already exists.');
      throw error;
    }
  }

  private digest(token: string) { return createHash('sha256').update(token).digest('hex'); }

  private async sendEmail(to: string, subject: string, text: string) {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;
    const appUrl = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
    if (!apiKey || !from) return false;
    const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from, to: [to], subject, text: `${text}\n\n${appUrl}` }) });
    if (!response.ok) throw new BadRequestException('Email delivery failed. Please try again later.');
    return true;
  }

  async requestPasswordReset(emailInput: string) {
    const email = String(emailInput || '').trim().toLowerCase();
    if (!email) return { message: 'If the account exists and email delivery is configured, reset instructions will be sent.' };
    const user = await this.userModel.findOne({ email, isActive: { $ne: false } }).exec();
    if (user) {
      const token = randomBytes(32).toString('hex');
      user.passwordResetTokenHash = this.digest(token);
      user.passwordResetExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
      await user.save();
      const delivered = await this.sendEmail(email, 'Reset your SalesPlus password', `Use this one-time token within 30 minutes to reset your password: ${token}`);
      if (!delivered) { user.passwordResetTokenHash = undefined; user.passwordResetExpiresAt = undefined; await user.save(); }
    }
    return { message: 'If the account exists and email delivery is configured, reset instructions will be sent.' };
  }

  async resetPassword(tokenInput: string, newPassword: string) {
    const token = String(tokenInput || '');
    if (token.length !== 64 || !newPassword || newPassword.length < 10) throw new BadRequestException('A valid reset token and password of at least 10 characters are required.');
    const user = await this.userModel.findOne({ passwordResetTokenHash: this.digest(token), passwordResetExpiresAt: { $gt: new Date() }, isActive: { $ne: false } }).exec();
    if (!user) throw new BadRequestException('Reset token is invalid or expired. Request a new password reset.');
    user.passwordHash = await bcrypt.hash(newPassword, 12);
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpiresAt = undefined;
    await user.save();
    return { message: 'Password updated. You can now sign in.' };
  }

  async requestEmailVerification(emailInput: string) {
    const email = String(emailInput || '').trim().toLowerCase();
    const user = await this.userModel.findOne({ email, emailVerified: false, isActive: { $ne: false } }).exec();
    if (user) {
      const token = randomBytes(32).toString('hex');
      user.emailVerificationTokenHash = this.digest(token);
      user.emailVerificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await user.save();
      const delivered = await this.sendEmail(email, 'Verify your SalesPlus email', `Use this one-time token within 24 hours to verify your email: ${token}`);
      if (!delivered) { user.emailVerificationTokenHash = undefined; user.emailVerificationExpiresAt = undefined; await user.save(); }
    }
    return { message: 'If email verification is required for this account and delivery is configured, instructions will be sent.' };
  }

  async verifyEmail(tokenInput: string) {
    const token = String(tokenInput || '');
    if (token.length !== 64) throw new BadRequestException('Verification token is invalid or expired.');
    const user = await this.userModel.findOne({ emailVerificationTokenHash: this.digest(token), emailVerificationExpiresAt: { $gt: new Date() }, isActive: { $ne: false } }).exec();
    if (!user) throw new BadRequestException('Verification token is invalid or expired.');
    user.emailVerified = true;
    user.emailVerificationTokenHash = undefined;
    user.emailVerificationExpiresAt = undefined;
    await user.save();
    return { message: 'Email verified.' };
  }

  async setupMfa(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new BadRequestException('User not found.');
    const secret = randomBytes(20).toString('hex').slice(0, 16).toUpperCase();
    const backupCodes = Array.from({ length: 6 }, () => randomBytes(4).toString('hex').toUpperCase());
    user.mfaSecret = secret;
    await user.save();
    const otpAuthUrl = `otpauth://totp/SalesPlus:${encodeURIComponent(user.email)}?secret=${secret}&issuer=SalesPlus`;
    return { secret, otpAuthUrl, backupCodes };
  }

  async verifyMfaToken(userId: string, code: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user || !user.mfaSecret) throw new BadRequestException('MFA not configured.');
    const codeClean = String(code || '').trim();
    // Allow matching backup codes or time-based window token hash check
    const isBackupCode = user.mfaBackupCodes && user.mfaBackupCodes.includes(codeClean);
    if (isBackupCode) {
      user.mfaBackupCodes = user.mfaBackupCodes.filter((c: string) => c !== codeClean);
      await user.save();
      return true;
    }
    // Simple verification check: check last digits of hash over window or exact match
    const window = Math.floor(Date.now() / 30000);
    const expected = createHash('sha256').update(`${user.mfaSecret}:${window}`).digest('hex');
    const expectedNum = (parseInt(expected.substring(0, 8), 16) % 1000000).toString().padStart(6, '0');
    const expectedPrev = (parseInt(createHash('sha256').update(`${user.mfaSecret}:${window - 1}`).digest('hex').substring(0, 8), 16) % 1000000).toString().padStart(6, '0');
    
    if (codeClean === expectedNum || codeClean === expectedPrev) {
      return true;
    }
    return false;
  }

  async enableMfa(userId: string, code: string, backupCodes: string[]) {
    const isValid = await this.verifyMfaToken(userId, code);
    if (!isValid) throw new BadRequestException('Invalid MFA verification code.');
    const user = await this.userModel.findById(userId).exec();
    user.mfaEnabled = true;
    user.mfaBackupCodes = backupCodes || [];
    await user.save();
    return { message: 'MFA enabled successfully.' };
  }

  async disableMfa(userId: string, code: string) {
    const isValid = await this.verifyMfaToken(userId, code);
    if (!isValid) throw new BadRequestException('Invalid MFA verification code.');
    const user = await this.userModel.findById(userId).exec();
    user.mfaEnabled = false;
    user.mfaSecret = undefined;
    user.mfaBackupCodes = [];
    await user.save();
    return { message: 'MFA disabled.' };
  }

  async login(user: any) {
    if (user.mfaEnabled) {
      return {
        mfaRequired: true,
        userId: user._id,
        email: user.email,
        message: 'MFA verification required.'
      };
    }
    const payload = {
      email: user.email,
      sub: user._id,
      role: user.role?.name,
      roleId: user.role?._id,
      customerId: user.customerId,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || '',
        role: user.role?.name,
        mfaEnabled: !!user.mfaEnabled,
        customerId: user.customerId
      }
    };
  }

  async completeMfaLogin(userId: string, code: string) {
    const user = await this.userModel.findById(userId).populate('role').exec();
    if (!user || !user.mfaEnabled) throw new BadRequestException('User invalid or MFA not enabled.');
    const isValid = await this.verifyMfaToken(userId, code);
    if (!isValid) throw new BadRequestException('Invalid MFA code.');
    const payload = {
      email: user.email,
      sub: user._id,
      role: user.role?.name,
      roleId: user.role?._id,
      customerId: user.customerId,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || '',
        role: user.role?.name,
        mfaEnabled: true,
        customerId: user.customerId
      }
    };
  }
}

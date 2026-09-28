import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'crypto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<any>,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).populate('role');
    if (user && await bcrypt.compare(pass, user.passwordHash)) {
      const { passwordHash, ...result } = user.toObject();
      return result;
    }
    return null;
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

  async login(user: any) {
    const payload = { email: user.email, sub: user._id, role: user.role?.name, roleId: user.role?._id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role?.name
      }
    };
  }
}

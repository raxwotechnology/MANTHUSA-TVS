import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpStatus, Req, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  private readonly attempts = new Map<string, number[]>();
  private readonly recoveryAttempts = new Map<string, number[]>();
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  async login(@Body() loginDto: any, @Req() request: any) {
    const key = request.ip || request.socket?.remoteAddress || 'unknown';
    const now = Date.now();
    const recent = (this.attempts.get(key) || []).filter((timestamp) => now - timestamp < 60_000);
    if (recent.length >= 10) throw new HttpException('Too many login attempts. Try again in one minute.', HttpStatus.TOO_MANY_REQUESTS);
    recent.push(now);
    this.attempts.set(key, recent);
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() body: any, @Req() request: any) {
    this.limitRecovery(request.ip || 'unknown');
    return this.authService.requestPasswordReset(body.email);
  }

  @Public()
  @Post('reset-password')
  resetPassword(@Body() body: any) { return this.authService.resetPassword(body.token, body.password); }

  @Public()
  @Post('request-email-verification')
  async requestEmailVerification(@Body() body: any, @Req() request: any) {
    this.limitRecovery(request.ip || 'unknown');
    return this.authService.requestEmailVerification(body.email);
  }

  @Public()
  @Post('verify-email')
  verifyEmail(@Body() body: any) { return this.authService.verifyEmail(body.token); }

  private limitRecovery(ip: string) {
    const now = Date.now();
    const attempts = (this.recoveryAttempts.get(ip) || []).filter(timestamp => now - timestamp < 60_000);
    if (attempts.length >= 5) throw new HttpException('Too many account recovery requests. Try again in one minute.', HttpStatus.TOO_MANY_REQUESTS);
    attempts.push(now); this.recoveryAttempts.set(ip, attempts);
  }
}

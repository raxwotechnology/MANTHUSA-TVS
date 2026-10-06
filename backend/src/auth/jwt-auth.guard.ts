import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly reflector: Reflector,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization as string | undefined;
    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('A valid bearer token is required.');
    }
    try {
      const payload = await this.jwt.verifyAsync(authorization.slice(7));
      if (payload.sub && Types.ObjectId.isValid(payload.sub)) {
        const user = await this.connection.collection('users').findOne({
          _id: new Types.ObjectId(payload.sub),
        });
        if (!user || user.isActive === false) {
          throw new UnauthorizedException('This user account is inactive.');
        }
      }
      request.user = payload;
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('The access token is invalid or expired.');
    }
  }
}

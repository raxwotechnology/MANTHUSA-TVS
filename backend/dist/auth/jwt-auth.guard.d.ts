import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Connection } from 'mongoose';
export declare class JwtAuthGuard implements CanActivate {
    private readonly jwt;
    private readonly reflector;
    private readonly connection;
    constructor(jwt: JwtService, reflector: Reflector, connection: Connection);
    canActivate(context: ExecutionContext): Promise<boolean>;
}

import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Connection } from 'mongoose';
export declare class RolesGuard implements CanActivate {
    private readonly reflector;
    private readonly connection;
    constructor(reflector: Reflector, connection: Connection);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private moduleName;
    private permissionFor;
}

import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import { IS_PUBLIC_KEY } from './public.decorator';
import { ROLES_KEY } from './roles.decorator';

const ADMIN_ROLES = ['Admin', 'Admin / Owner'];

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, @InjectConnection() private readonly connection: Connection) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
    if (isPublic) return true;
    const allowed = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    const request = context.switchToHttp().getRequest();
    const role = request.user?.role;
    if (role && ADMIN_ROLES.includes(role)) return true;
    if (role && (allowed?.includes(role) ?? false)) {
      const action = this.permissionFor(request.method, request.path);
      const roleId = request.user?.roleId;
      if (roleId && Types.ObjectId.isValid(roleId)) {
        const permission = await this.connection.collection('permissions').findOne({
          role: new Types.ObjectId(roleId), module: this.moduleName(context),
        });
        if (permission) {
          if (permission[action] === true) return true;
          throw new ForbiddenException(`The ${action} permission is disabled for this module.`);
        }
      }
      return true;
    }
    throw new ForbiddenException('Your role does not have permission to perform this action.');
  }

  private moduleName(context: ExecutionContext): string {
    return context.getClass().name.replace(/Controller$/, '').replace(/[A-Z]/g, (letter, index) => `${index ? '-' : ''}${letter.toLowerCase()}`);
  }

  private permissionFor(method: string, path: string): string {
    if (/export/i.test(path)) return 'canExport';
    if (/approve|decision|complete/i.test(path)) return 'canApprove';
    if (method === 'GET') return 'canView';
    if (method === 'POST') return 'canCreate';
    if (method === 'DELETE') return 'canDelete';
    return 'canEdit';
  }
}

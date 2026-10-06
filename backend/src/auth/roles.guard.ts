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
    if (!role) throw new ForbiddenException('User role is missing or unassigned.');
    if (this.isAdminRole(role)) return true;
    if (!allowed || allowed.length === 0 || this.matchRoles(role, allowed)) {
      const action = this.permissionFor(request.method, request.path);
      const roleId = request.user?.roleId;
      if (roleId && Types.ObjectId.isValid(roleId)) {
        const permissions = this.connection.collection('permissions');
        const permission = await permissions.findOne({
          role: new Types.ObjectId(roleId),
          module: this.moduleName(context),
        });
        const hasConfiguredPermissions = await permissions.findOne({
          role: new Types.ObjectId(roleId),
        });
        if (permission?.[action] === true) return true;
        if (hasConfiguredPermissions) {
          throw new ForbiddenException(`The ${action} permission is disabled for this module.`);
        }
      }
      return true;
    }
    throw new ForbiddenException(`Your role (${role}) does not have permission to access this resource.`);
  }

  private isAdminRole(role: string): boolean {
    const r = (role || '').toLowerCase();
    return r.includes('admin') || r.includes('owner');
  }

  private matchRoles(userRole: string, allowedRoles: string[]): boolean {
    if (!allowedRoles || allowedRoles.length === 0) return true;
    const cleanUserRole = (userRole || '').toLowerCase().trim();

    return allowedRoles.some((allowed) => {
      const cleanAllowed = allowed.toLowerCase().trim();
      if (cleanUserRole === cleanAllowed) return true;
      if ((cleanAllowed.includes('sales') || cleanAllowed.includes('operations')) && (cleanUserRole.includes('sales') || cleanUserRole.includes('executive') || cleanUserRole.includes('operations'))) return true;
      if ((cleanAllowed.includes('accountant') || cleanAllowed.includes('finance')) && (cleanUserRole.includes('accountant') || cleanUserRole.includes('finance'))) return true;
      if (cleanAllowed.includes('inventory') && cleanUserRole.includes('inventory')) return true;
      if (cleanAllowed.includes('customer') && (cleanUserRole.includes('customer') || cleanUserRole.includes('client'))) return true;
      if ((cleanAllowed.includes('admin') || cleanAllowed.includes('owner')) && (cleanUserRole.includes('admin') || cleanUserRole.includes('owner'))) return true;
      return false;
    });
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

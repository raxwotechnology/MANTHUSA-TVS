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
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const public_decorator_1 = require("./public.decorator");
const roles_decorator_1 = require("./roles.decorator");
const ADMIN_ROLES = ['Admin', 'Admin / Owner'];
let RolesGuard = class RolesGuard {
    reflector;
    connection;
    constructor(reflector, connection) {
        this.reflector = reflector;
        this.connection = connection;
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
        if (isPublic)
            return true;
        const allowed = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [context.getHandler(), context.getClass()]);
        const request = context.switchToHttp().getRequest();
        const role = request.user?.role;
        if (!role)
            throw new common_1.ForbiddenException('User role is missing or unassigned.');
        if (this.isAdminRole(role))
            return true;
        if (!allowed || allowed.length === 0 || this.matchRoles(role, allowed)) {
            const action = this.permissionFor(request.method, request.path);
            const roleId = request.user?.roleId;
            if (roleId && mongoose_2.Types.ObjectId.isValid(roleId)) {
                const permissions = this.connection.collection('permissions');
                const permission = await permissions.findOne({
                    role: new mongoose_2.Types.ObjectId(roleId),
                    module: this.moduleName(context),
                });
                const hasConfiguredPermissions = await permissions.findOne({
                    role: new mongoose_2.Types.ObjectId(roleId),
                });
                if (permission?.[action] === true)
                    return true;
                if (hasConfiguredPermissions) {
                    throw new common_1.ForbiddenException(`The ${action} permission is disabled for this module.`);
                }
            }
            return true;
        }
        throw new common_1.ForbiddenException(`Your role (${role}) does not have permission to access this resource.`);
    }
    isAdminRole(role) {
        const r = (role || '').toLowerCase();
        return r.includes('admin') || r.includes('owner');
    }
    matchRoles(userRole, allowedRoles) {
        if (!allowedRoles || allowedRoles.length === 0)
            return true;
        const cleanUserRole = (userRole || '').toLowerCase().trim();
        return allowedRoles.some((allowed) => {
            const cleanAllowed = allowed.toLowerCase().trim();
            if (cleanUserRole === cleanAllowed)
                return true;
            if ((cleanAllowed.includes('sales') || cleanAllowed.includes('operations')) && (cleanUserRole.includes('sales') || cleanUserRole.includes('executive') || cleanUserRole.includes('operations')))
                return true;
            if ((cleanAllowed.includes('accountant') || cleanAllowed.includes('finance')) && (cleanUserRole.includes('accountant') || cleanUserRole.includes('finance')))
                return true;
            if (cleanAllowed.includes('inventory') && cleanUserRole.includes('inventory'))
                return true;
            if (cleanAllowed.includes('customer') && (cleanUserRole.includes('customer') || cleanUserRole.includes('client')))
                return true;
            if ((cleanAllowed.includes('admin') || cleanAllowed.includes('owner')) && (cleanUserRole.includes('admin') || cleanUserRole.includes('owner')))
                return true;
            return false;
        });
    }
    moduleName(context) {
        return context.getClass().name.replace(/Controller$/, '').replace(/[A-Z]/g, (letter, index) => `${index ? '-' : ''}${letter.toLowerCase()}`);
    }
    permissionFor(method, path) {
        if (/export/i.test(path))
            return 'canExport';
        if (/approve|decision|complete/i.test(path))
            return 'canApprove';
        if (method === 'GET')
            return 'canView';
        if (method === 'POST')
            return 'canCreate';
        if (method === 'DELETE')
            return 'canDelete';
        return 'canEdit';
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [core_1.Reflector, mongoose_2.Connection])
], RolesGuard);
//# sourceMappingURL=roles.guard.js.map
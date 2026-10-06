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
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const public_decorator_1 = require("./public.decorator");
let JwtAuthGuard = class JwtAuthGuard {
    jwt;
    reflector;
    connection;
    constructor(jwt, reflector, connection) {
        this.jwt = jwt;
        this.reflector = reflector;
        this.connection = connection;
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic)
            return true;
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization;
        if (!authorization?.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('A valid bearer token is required.');
        }
        try {
            const payload = await this.jwt.verifyAsync(authorization.slice(7));
            if (payload.sub && mongoose_2.Types.ObjectId.isValid(payload.sub)) {
                const user = await this.connection.collection('users').findOne({
                    _id: new mongoose_2.Types.ObjectId(payload.sub),
                });
                if (!user || user.isActive === false) {
                    throw new common_1.UnauthorizedException('This user account is inactive.');
                }
            }
            request.user = payload;
            return true;
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException)
                throw error;
            throw new common_1.UnauthorizedException('The access token is invalid or expired.');
        }
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        core_1.Reflector,
        mongoose_2.Connection])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map
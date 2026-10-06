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
exports.LeasingPartnersController = void 0;
const common_1 = require("@nestjs/common");
const leasing_partners_service_1 = require("./leasing-partners.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let LeasingPartnersController = class LeasingPartnersController {
    leasingPartnersService;
    constructor(leasingPartnersService) {
        this.leasingPartnersService = leasingPartnersService;
    }
    create(dto) {
        return this.leasingPartnersService.create(dto);
    }
    findAll() {
        return this.leasingPartnersService.findAll();
    }
    update(id, dto) {
        return this.leasingPartnersService.update(id, dto);
    }
    remove(id) {
        return this.leasingPartnersService.remove(id);
    }
};
exports.LeasingPartnersController = LeasingPartnersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LeasingPartnersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LeasingPartnersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LeasingPartnersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeasingPartnersController.prototype, "remove", null);
exports.LeasingPartnersController = LeasingPartnersController = __decorate([
    (0, common_1.Controller)('leasing-partners'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)('Accountant / Finance Staff'),
    __metadata("design:paramtypes", [leasing_partners_service_1.LeasingPartnersService])
], LeasingPartnersController);
//# sourceMappingURL=leasing-partners.controller.js.map
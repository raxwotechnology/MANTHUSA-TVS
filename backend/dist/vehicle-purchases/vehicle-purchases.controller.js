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
exports.VehiclePurchasesController = void 0;
const common_1 = require("@nestjs/common");
const vehicle_purchases_service_1 = require("./vehicle-purchases.service");
const roles_decorator_1 = require("../auth/roles.decorator");
let VehiclePurchasesController = class VehiclePurchasesController {
    purchases;
    constructor(purchases) {
        this.purchases = purchases;
    }
    create(body) { return this.purchases.create(body); }
    findAll() { return this.purchases.findAll(); }
    findOne(id) { return this.purchases.findOne(id); }
};
exports.VehiclePurchasesController = VehiclePurchasesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VehiclePurchasesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VehiclePurchasesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VehiclePurchasesController.prototype, "findOne", null);
exports.VehiclePurchasesController = VehiclePurchasesController = __decorate([
    (0, common_1.Controller)('vehicle-purchases'),
    (0, roles_decorator_1.Roles)('Sales & Operations', 'Accountant / Finance Staff'),
    __metadata("design:paramtypes", [vehicle_purchases_service_1.VehiclePurchasesService])
], VehiclePurchasesController);
//# sourceMappingURL=vehicle-purchases.controller.js.map
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
exports.AfterSalesController = void 0;
const common_1 = require("@nestjs/common");
const after_sales_service_1 = require("./after-sales.service");
const roles_decorator_1 = require("../auth/roles.decorator");
let AfterSalesController = class AfterSalesController {
    afterSales;
    constructor(afterSales) {
        this.afterSales = afterSales;
    }
    create(body) { return this.afterSales.create(body); }
    findAll() { return this.afterSales.findAll(); }
    getMta6Form(id) { return this.afterSales.getMta6Form(id); }
    getMta8Form(id) { return this.afterSales.getMta8Form(id); }
    update(id, body) { return this.afterSales.update(id, body); }
    remove(id) { return this.afterSales.remove(id); }
};
exports.AfterSalesController = AfterSalesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AfterSalesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AfterSalesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id/mta6'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AfterSalesController.prototype, "getMta6Form", null);
__decorate([
    (0, common_1.Get)(':id/mta8'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AfterSalesController.prototype, "getMta8Form", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AfterSalesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AfterSalesController.prototype, "remove", null);
exports.AfterSalesController = AfterSalesController = __decorate([
    (0, common_1.Controller)('after-sales'),
    (0, roles_decorator_1.Roles)('Sales & Operations'),
    __metadata("design:paramtypes", [after_sales_service_1.AfterSalesService])
], AfterSalesController);
//# sourceMappingURL=after-sales.controller.js.map
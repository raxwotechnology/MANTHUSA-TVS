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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleCostSchema = exports.VehicleCost = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let VehicleCost = class VehicleCost {
    vehicle;
    purchasePrice;
    importCost;
    transportCost;
    repairCost;
    detailingCost;
    registrationCost;
    insuranceCost;
    advertisementCost;
    otherCosts;
    totalInvestment;
    sellingPrice;
    minimumSellingPrice;
    expectedProfit;
};
exports.VehicleCost = VehicleCost;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Vehicle', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], VehicleCost.prototype, "vehicle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], VehicleCost.prototype, "purchasePrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], VehicleCost.prototype, "importCost", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], VehicleCost.prototype, "transportCost", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], VehicleCost.prototype, "repairCost", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], VehicleCost.prototype, "detailingCost", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], VehicleCost.prototype, "registrationCost", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], VehicleCost.prototype, "insuranceCost", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], VehicleCost.prototype, "advertisementCost", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], VehicleCost.prototype, "otherCosts", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], VehicleCost.prototype, "totalInvestment", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], VehicleCost.prototype, "sellingPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], VehicleCost.prototype, "minimumSellingPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], VehicleCost.prototype, "expectedProfit", void 0);
exports.VehicleCost = VehicleCost = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], VehicleCost);
exports.VehicleCostSchema = mongoose_1.SchemaFactory.createForClass(VehicleCost);
//# sourceMappingURL=vehicle-cost.schema.js.map
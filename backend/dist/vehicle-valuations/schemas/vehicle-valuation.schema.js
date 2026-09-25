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
exports.VehicleValuationSchema = exports.VehicleValuation = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let VehicleValuation = class VehicleValuation {
    valuationId;
    customerName;
    customerPhone;
    customerEmail;
    vehicleMake;
    vehicleModel;
    year;
    mileage;
    condition;
    askingPrice;
    marketValuation;
    repairEstimate;
    offeredPurchasePrice;
    status;
    images;
    notes;
};
exports.VehicleValuation = VehicleValuation;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], VehicleValuation.prototype, "valuationId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], VehicleValuation.prototype, "customerName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], VehicleValuation.prototype, "customerPhone", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], VehicleValuation.prototype, "customerEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], VehicleValuation.prototype, "vehicleMake", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], VehicleValuation.prototype, "vehicleModel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], VehicleValuation.prototype, "year", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], VehicleValuation.prototype, "mileage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], VehicleValuation.prototype, "condition", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], VehicleValuation.prototype, "askingPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], VehicleValuation.prototype, "marketValuation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], VehicleValuation.prototype, "repairEstimate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], VehicleValuation.prototype, "offeredPurchasePrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Pending', enum: ['Pending', 'Inspection Scheduled', 'Inspected', 'Offer Made', 'Accepted', 'Rejected'] }),
    __metadata("design:type", String)
], VehicleValuation.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], VehicleValuation.prototype, "images", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], VehicleValuation.prototype, "notes", void 0);
exports.VehicleValuation = VehicleValuation = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], VehicleValuation);
exports.VehicleValuationSchema = mongoose_1.SchemaFactory.createForClass(VehicleValuation);
//# sourceMappingURL=vehicle-valuation.schema.js.map
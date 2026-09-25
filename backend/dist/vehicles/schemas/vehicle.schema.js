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
exports.VehicleSchema = exports.Vehicle = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Vehicle = class Vehicle {
    stockNumber;
    registrationNumber;
    make;
    model;
    variant;
    manufacturingYear;
    registeredYear;
    vehicleType;
    condition;
    fuelType;
    transmission;
    driveType;
    engineCapacity;
    engineNumber;
    chassisNumber;
    mileage;
    color;
    status;
    location;
};
exports.Vehicle = Vehicle;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "stockNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Vehicle.prototype, "registrationNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "make", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "model", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Vehicle.prototype, "variant", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Vehicle.prototype, "manufacturingYear", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Vehicle.prototype, "registeredYear", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Vehicle.prototype, "vehicleType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Vehicle.prototype, "condition", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Vehicle.prototype, "fuelType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Vehicle.prototype, "transmission", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Vehicle.prototype, "driveType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Vehicle.prototype, "engineCapacity", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Vehicle.prototype, "engineNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Vehicle.prototype, "chassisNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Vehicle.prototype, "mileage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Vehicle.prototype, "color", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Available' }),
    __metadata("design:type", String)
], Vehicle.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Branch' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Vehicle.prototype, "location", void 0);
exports.Vehicle = Vehicle = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Vehicle);
exports.VehicleSchema = mongoose_1.SchemaFactory.createForClass(Vehicle);
//# sourceMappingURL=vehicle.schema.js.map
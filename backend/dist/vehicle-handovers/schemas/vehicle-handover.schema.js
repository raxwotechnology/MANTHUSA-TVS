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
exports.VehicleHandoverSchema = exports.VehicleHandover = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let VehicleHandover = class VehicleHandover {
    sale;
    vehicle;
    customer;
    checklist;
    status;
    handoverDate;
};
exports.VehicleHandover = VehicleHandover;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Sale', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], VehicleHandover.prototype, "sale", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Vehicle', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], VehicleHandover.prototype, "vehicle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Customer', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], VehicleHandover.prototype, "customer", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], VehicleHandover.prototype, "checklist", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Pending' }),
    __metadata("design:type", String)
], VehicleHandover.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], VehicleHandover.prototype, "handoverDate", void 0);
exports.VehicleHandover = VehicleHandover = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], VehicleHandover);
exports.VehicleHandoverSchema = mongoose_1.SchemaFactory.createForClass(VehicleHandover);
//# sourceMappingURL=vehicle-handover.schema.js.map
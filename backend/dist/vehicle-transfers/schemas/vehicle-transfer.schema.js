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
exports.VehicleTransferSchema = exports.VehicleTransfer = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let VehicleTransfer = class VehicleTransfer {
    transferId;
    vehicle;
    fromBranch;
    toBranch;
    transferDate;
    driverName;
    transportCost;
    reason;
    status;
};
exports.VehicleTransfer = VehicleTransfer;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], VehicleTransfer.prototype, "transferId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Vehicle', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], VehicleTransfer.prototype, "vehicle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Branch', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], VehicleTransfer.prototype, "fromBranch", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Branch', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], VehicleTransfer.prototype, "toBranch", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], VehicleTransfer.prototype, "transferDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], VehicleTransfer.prototype, "driverName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], VehicleTransfer.prototype, "transportCost", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], VehicleTransfer.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Pending', enum: ['Pending', 'In Transit', 'Completed', 'Cancelled'] }),
    __metadata("design:type", String)
], VehicleTransfer.prototype, "status", void 0);
exports.VehicleTransfer = VehicleTransfer = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], VehicleTransfer);
exports.VehicleTransferSchema = mongoose_1.SchemaFactory.createForClass(VehicleTransfer);
//# sourceMappingURL=vehicle-transfer.schema.js.map
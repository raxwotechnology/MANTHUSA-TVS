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
exports.RefundSchema = exports.Refund = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Refund = class Refund {
    customer;
    sale;
    reservation;
    amount;
    refundDate;
    reason;
    paymentMethod;
    status;
};
exports.Refund = Refund;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Customer', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Refund.prototype, "customer", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Sale' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Refund.prototype, "sale", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Reservation' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Refund.prototype, "reservation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Refund.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Refund.prototype, "refundDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Refund.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Refund.prototype, "paymentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Completed' }),
    __metadata("design:type", String)
], Refund.prototype, "status", void 0);
exports.Refund = Refund = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Refund);
exports.RefundSchema = mongoose_1.SchemaFactory.createForClass(Refund);
//# sourceMappingURL=refund.schema.js.map
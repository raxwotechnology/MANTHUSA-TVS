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
exports.DiscountRequestSchema = exports.DiscountRequest = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let DiscountRequest = class DiscountRequest {
    quotation;
    sale;
    requestedBy;
    requestedDiscount;
    reason;
    status;
    approvedBy;
    approvalDate;
};
exports.DiscountRequest = DiscountRequest;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Quotation' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], DiscountRequest.prototype, "quotation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Sale' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], DiscountRequest.prototype, "sale", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], DiscountRequest.prototype, "requestedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DiscountRequest.prototype, "requestedDiscount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DiscountRequest.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Pending' }),
    __metadata("design:type", String)
], DiscountRequest.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], DiscountRequest.prototype, "approvedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], DiscountRequest.prototype, "approvalDate", void 0);
exports.DiscountRequest = DiscountRequest = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], DiscountRequest);
exports.DiscountRequestSchema = mongoose_1.SchemaFactory.createForClass(DiscountRequest);
//# sourceMappingURL=discount-request.schema.js.map
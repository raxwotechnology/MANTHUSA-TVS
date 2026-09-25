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
exports.InstallmentSchema = exports.Installment = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Installment = class Installment {
    agreement;
    installmentNumber;
    dueDate;
    amount;
    status;
    paidDate;
};
exports.Installment = Installment;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'InstallmentAgreement', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Installment.prototype, "agreement", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Installment.prototype, "installmentNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Installment.prototype, "dueDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Installment.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Pending' }),
    __metadata("design:type", String)
], Installment.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Installment.prototype, "paidDate", void 0);
exports.Installment = Installment = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Installment);
exports.InstallmentSchema = mongoose_1.SchemaFactory.createForClass(Installment);
//# sourceMappingURL=installment.schema.js.map
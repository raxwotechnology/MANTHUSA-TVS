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
exports.InstallmentAgreementSchema = exports.InstallmentAgreement = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let InstallmentAgreement = class InstallmentAgreement {
    sale;
    customer;
    financeCompany;
    loanAmount;
    downPayment;
    interestRate;
    loanPeriodMonths;
    monthlyInstallment;
    startDate;
    endDate;
};
exports.InstallmentAgreement = InstallmentAgreement;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Sale', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], InstallmentAgreement.prototype, "sale", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Customer', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], InstallmentAgreement.prototype, "customer", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], InstallmentAgreement.prototype, "financeCompany", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], InstallmentAgreement.prototype, "loanAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], InstallmentAgreement.prototype, "downPayment", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], InstallmentAgreement.prototype, "interestRate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], InstallmentAgreement.prototype, "loanPeriodMonths", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], InstallmentAgreement.prototype, "monthlyInstallment", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], InstallmentAgreement.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], InstallmentAgreement.prototype, "endDate", void 0);
exports.InstallmentAgreement = InstallmentAgreement = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], InstallmentAgreement);
exports.InstallmentAgreementSchema = mongoose_1.SchemaFactory.createForClass(InstallmentAgreement);
//# sourceMappingURL=installment-agreement.schema.js.map
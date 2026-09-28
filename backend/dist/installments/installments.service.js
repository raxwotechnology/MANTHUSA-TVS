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
exports.InstallmentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let InstallmentsService = class InstallmentsService {
    installments;
    agreements;
    sales;
    cash;
    constructor(installments, agreements, sales, cash) {
        this.installments = installments;
        this.agreements = agreements;
        this.sales = sales;
        this.cash = cash;
    }
    async createAgreement(input) {
        const months = Number(input.loanPeriodMonths);
        const principal = Number(input.loanAmount);
        const downPayment = Number(input.downPayment || 0);
        const rate = Number(input.interestRate || 0) / 1200;
        const start = new Date(input.startDate);
        if (!input.sale || !input.customer || !input.financeCompany || !Number.isInteger(months) || months < 1 || principal <= 0 || downPayment < 0 || downPayment > principal || Number.isNaN(start.getTime())) {
            throw new common_1.BadRequestException('Sale, customer, finance company, valid loan amount/term and start date are required.');
        }
        const sale = await this.sales.findById(input.sale).exec();
        if (!sale)
            throw new common_1.NotFoundException('Sale not found.');
        const loanAmount = principal - downPayment;
        const monthlyInstallment = Number(input.monthlyInstallment) || (rate ? loanAmount * rate / (1 - Math.pow(1 + rate, -months)) : loanAmount / months);
        const endDate = new Date(start);
        endDate.setMonth(endDate.getMonth() + months - 1);
        const agreement = await new this.agreements({ ...input, loanAmount, downPayment, monthlyInstallment, loanPeriodMonths: months, endDate }).save();
        const schedule = Array.from({ length: months }, (_, i) => {
            const dueDate = new Date(start);
            dueDate.setMonth(dueDate.getMonth() + i);
            return { agreement: agreement._id, installmentNumber: i + 1, dueDate, amount: monthlyInstallment, status: 'Pending' };
        });
        await this.installments.insertMany(schedule);
        return { agreement, schedule };
    }
    listAgreements() { return this.agreements.find().populate('sale').populate('customer').sort({ createdAt: -1 }).exec(); }
    async getSchedule(agreementId) {
        const agreement = await this.agreements.findById(agreementId).exec();
        if (!agreement)
            throw new common_1.NotFoundException('Finance agreement not found.');
        const rows = await this.installments.find({ agreement: agreementId }).sort({ installmentNumber: 1 }).exec();
        const now = new Date();
        return rows.map((row) => row.status === 'Pending' && row.dueDate < now ? { ...row.toObject(), status: 'Overdue' } : row);
    }
    async markPaid(id, input) {
        const installment = await this.installments.findById(id).exec();
        if (!installment)
            throw new common_1.NotFoundException('Installment not found.');
        if (installment.status === 'Paid')
            throw new common_1.BadRequestException('Installment has already been paid.');
        const agreement = await this.agreements.findById(installment.agreement).exec();
        if (!agreement)
            throw new common_1.NotFoundException('Finance agreement not found.');
        installment.status = 'Paid';
        installment.paidDate = input.paidDate ? new Date(input.paidDate) : new Date();
        await installment.save();
        await new this.cash({ transactionType: 'IN', amount: installment.amount, transactionDate: installment.paidDate, source: 'CustomerPayment', referenceId: installment._id, description: `Finance installment ${installment.installmentNumber}` }).save();
        return installment;
    }
};
exports.InstallmentsService = InstallmentsService;
exports.InstallmentsService = InstallmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Installment')),
    __param(1, (0, mongoose_1.InjectModel)('InstallmentAgreement')),
    __param(2, (0, mongoose_1.InjectModel)('Sale')),
    __param(3, (0, mongoose_1.InjectModel)('CashTransaction')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], InstallmentsService);
//# sourceMappingURL=installments.service.js.map
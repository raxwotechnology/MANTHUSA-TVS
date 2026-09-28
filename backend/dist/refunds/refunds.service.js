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
exports.RefundsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let RefundsService = class RefundsService {
    refunds;
    sales;
    reservations;
    cash;
    constructor(refunds, sales, reservations, cash) {
        this.refunds = refunds;
        this.sales = sales;
        this.reservations = reservations;
        this.cash = cash;
    }
    async create(input) {
        const amount = Number(input.amount);
        if (!input.customer || !Number.isFinite(amount) || amount <= 0 || (!input.sale && !input.reservation))
            throw new common_1.BadRequestException('Customer, positive amount and sale or reservation are required.');
        let source;
        if (input.sale) {
            source = await this.sales.findById(input.sale).exec();
            if (!source)
                throw new common_1.NotFoundException('Sale not found.');
            if (amount > Number(source.paidAmount || 0))
                throw new common_1.BadRequestException('Refund exceeds the amount paid.');
        }
        else {
            source = await this.reservations.findById(input.reservation).exec();
            if (!source)
                throw new common_1.NotFoundException('Reservation not found.');
            if (!source.isRefundable)
                throw new common_1.BadRequestException('This reservation deposit is not refundable.');
            if (amount > Number(source.reservationDeposit || 0))
                throw new common_1.BadRequestException('Refund exceeds the reservation deposit.');
        }
        const refund = await new this.refunds({ ...input, amount, refundDate: input.refundDate || new Date(), status: 'Completed' }).save();
        if (input.sale) {
            source.paidAmount = Number(source.paidAmount || 0) - amount;
            source.balance = Math.max(0, Number(source.finalAmount || 0) - source.paidAmount);
            source.status = 'Refunded';
        }
        else {
            source.status = 'Cancelled';
            source.refundStatus = 'Refunded';
        }
        await source.save();
        await new this.cash({ transactionType: 'OUT', amount, transactionDate: refund.refundDate, source: 'Refund', referenceId: refund._id, description: input.reason || 'Customer refund' }).save();
        return refund;
    }
    findAll() { return this.refunds.find().populate('customer').populate('sale').populate('reservation').sort({ refundDate: -1 }).exec(); }
};
exports.RefundsService = RefundsService;
exports.RefundsService = RefundsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Refund')),
    __param(1, (0, mongoose_1.InjectModel)('Sale')),
    __param(2, (0, mongoose_1.InjectModel)('Reservation')),
    __param(3, (0, mongoose_1.InjectModel)('CashTransaction')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], RefundsService);
//# sourceMappingURL=refunds.service.js.map
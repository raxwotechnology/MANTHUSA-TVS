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
    vehicles;
    constructor(refunds, sales, reservations, cash, vehicles) {
        this.refunds = refunds;
        this.sales = sales;
        this.reservations = reservations;
        this.cash = cash;
        this.vehicles = vehicles;
    }
    async create(input) {
        const amount = Number(input.amount);
        if (!(0, mongoose_2.isValidObjectId)(input.customer) || !Number.isFinite(amount) || amount <= 0 || Boolean(input.sale) === Boolean(input.reservation))
            throw new common_1.BadRequestException('Customer, positive amount and exactly one sale or reservation are required.');
        let source;
        let reservationRefunded = 0;
        if (input.sale) {
            if (!(0, mongoose_2.isValidObjectId)(input.sale))
                throw new common_1.BadRequestException('Sale ID is invalid.');
            source = await this.sales.findById(input.sale).exec();
            if (!source)
                throw new common_1.NotFoundException('Sale not found.');
            if (source.customer.toString() !== input.customer.toString())
                throw new common_1.BadRequestException('Refund customer does not match the sale.');
            if (amount > Number(source.paidAmount || 0))
                throw new common_1.BadRequestException('Refund exceeds the amount paid.');
        }
        else {
            if (!(0, mongoose_2.isValidObjectId)(input.reservation))
                throw new common_1.BadRequestException('Reservation ID is invalid.');
            source = await this.reservations.findById(input.reservation).exec();
            if (!source)
                throw new common_1.NotFoundException('Reservation not found.');
            if (source.customer.toString() !== input.customer.toString())
                throw new common_1.BadRequestException('Refund customer does not match the reservation.');
            if (source.status === 'ConvertedToSale')
                throw new common_1.BadRequestException('Refund the resulting sale instead of its converted reservation.');
            if (!source.isRefundable)
                throw new common_1.BadRequestException('This reservation deposit is not refundable.');
            const previousRefunds = await this.refunds.find({ reservation: source._id, status: 'Completed' }).select('amount').lean().exec();
            reservationRefunded = previousRefunds.reduce((sum, row) => sum + Number(row.amount || 0), 0);
            if (amount > Number(source.reservationDeposit || 0) - reservationRefunded)
                throw new common_1.BadRequestException('Refund exceeds the unrefunded reservation deposit.');
        }
        const refund = await new this.refunds({ ...input, amount, refundDate: input.refundDate || new Date(), status: 'Completed' }).save();
        if (input.sale) {
            const previouslyPaid = Number(source.paidAmount || 0);
            source.paidAmount = Number(source.paidAmount || 0) - amount;
            source.balance = Math.max(0, Number(source.finalAmount || 0) - source.paidAmount);
            if (amount >= previouslyPaid) {
                source.status = 'Refunded';
                const vehicle = await this.vehicles.findById(source.vehicle).exec();
                if (vehicle?.status === 'Sold') {
                    vehicle.status = 'Available';
                    await vehicle.save();
                }
            }
        }
        else {
            source.status = 'Cancelled';
            source.refundStatus = amount + reservationRefunded >= Number(source.reservationDeposit || 0) ? 'Refunded' : 'Partially Refunded';
            const vehicle = await this.vehicles.findById(source.vehicle).exec();
            if (vehicle?.status === 'Reserved') {
                vehicle.status = 'Available';
                await vehicle.save();
            }
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
    __param(4, (0, mongoose_1.InjectModel)('Vehicle')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], RefundsService);
//# sourceMappingURL=refunds.service.js.map
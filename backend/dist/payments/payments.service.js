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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const notifications_service_1 = require("../notifications/notifications.service");
let PaymentsService = class PaymentsService {
    paymentModel;
    saleModel;
    cashModel;
    notifications;
    constructor(paymentModel, saleModel, cashModel, notifications) {
        this.paymentModel = paymentModel;
        this.saleModel = saleModel;
        this.cashModel = cashModel;
        this.notifications = notifications;
    }
    async create(input) {
        const amount = Number(input.amount);
        if (!input.sale || amount <= 0 || !Number.isFinite(amount) || !input.paymentMethod) {
            throw new common_1.BadRequestException('Sale, positive payment amount and payment method are required.');
        }
        const sale = await this.saleModel.findById(input.sale).exec();
        if (!sale)
            throw new common_1.NotFoundException('Sale not found.');
        const balance = Number(sale.finalAmount || 0) - Number(sale.paidAmount || 0);
        if (amount > balance)
            throw new common_1.BadRequestException(`Payment exceeds the outstanding balance of ${balance}.`);
        const receiptNumber = input.receiptNumber || `RCP-${Date.now()}`;
        const payment = await new this.paymentModel({
            ...input,
            customer: input.customer || sale.customer,
            amount,
            paymentDate: input.paymentDate || new Date(),
            receiptNumber,
        }).save();
        sale.paidAmount = Number(sale.paidAmount || 0) + amount;
        sale.balance = Number(sale.finalAmount || 0) - sale.paidAmount;
        await sale.save();
        await new this.cashModel({
            transactionType: 'IN', amount, transactionDate: payment.paymentDate,
            source: 'CustomerPayment', referenceId: payment._id,
            description: `Receipt ${receiptNumber} for sale ${sale.invoiceNumber}`,
        }).save();
        await this.notifications.create({ title: 'Customer payment received', message: `Receipt ${receiptNumber} received for invoice ${sale.invoiceNumber}.`, channel: 'in-app', entityType: 'Payment', entityId: String(payment._id) }).catch(() => undefined);
        return payment;
    }
    findAll() {
        return this.paymentModel.find().populate('sale').populate('customer').sort({ createdAt: -1 }).exec();
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Payment')),
    __param(1, (0, mongoose_1.InjectModel)('Sale')),
    __param(2, (0, mongoose_1.InjectModel)('CashTransaction')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        notifications_service_1.NotificationsService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map
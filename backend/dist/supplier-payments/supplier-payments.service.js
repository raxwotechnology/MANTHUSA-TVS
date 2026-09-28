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
exports.SupplierPaymentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let SupplierPaymentsService = class SupplierPaymentsService {
    payments;
    suppliers;
    cash;
    constructor(payments, suppliers, cash) {
        this.payments = payments;
        this.suppliers = suppliers;
        this.cash = cash;
    }
    async create(input) {
        const amount = Number(input.amount);
        if (!input.supplier || !Number.isFinite(amount) || amount <= 0)
            throw new common_1.BadRequestException('Supplier and positive payment amount are required.');
        const supplier = await this.suppliers.findById(input.supplier).exec();
        if (!supplier)
            throw new common_1.NotFoundException('Supplier not found.');
        if (amount > Number(supplier.outstandingBalance || 0))
            throw new common_1.BadRequestException('Payment exceeds supplier outstanding balance.');
        const payment = await new this.payments({ ...input, amount, paymentDate: input.paymentDate || new Date() }).save();
        supplier.outstandingBalance = Math.max(0, Number(supplier.outstandingBalance || 0) - amount);
        await supplier.save();
        await new this.cash({ transactionType: 'OUT', amount, transactionDate: payment.paymentDate, source: 'SupplierPayment', referenceId: payment._id, description: `Payment to supplier ${supplier.name}` }).save();
        return payment;
    }
    findAll() { return this.payments.find().populate('supplier').populate('purchase').sort({ paymentDate: -1 }).exec(); }
};
exports.SupplierPaymentsService = SupplierPaymentsService;
exports.SupplierPaymentsService = SupplierPaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('SupplierPayment')),
    __param(1, (0, mongoose_1.InjectModel)('Supplier')),
    __param(2, (0, mongoose_1.InjectModel)('CashTransaction')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], SupplierPaymentsService);
//# sourceMappingURL=supplier-payments.service.js.map
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SupplierPaymentsService {
  constructor(
    @InjectModel('SupplierPayment') private readonly payments: Model<any>,
    @InjectModel('Supplier') private readonly suppliers: Model<any>,
    @InjectModel('CashTransaction') private readonly cash: Model<any>,
  ) {}
  async create(input: any) {
    const amount = Number(input.amount);
    if (!input.supplier || !Number.isFinite(amount) || amount <= 0) throw new BadRequestException('Supplier and positive payment amount are required.');
    const supplier = await this.suppliers.findById(input.supplier).exec();
    if (!supplier) throw new NotFoundException('Supplier not found.');
    if (amount > Number(supplier.outstandingBalance || 0)) throw new BadRequestException('Payment exceeds supplier outstanding balance.');
    const payment = await new this.payments({ ...input, amount, paymentDate: input.paymentDate || new Date() }).save();
    supplier.outstandingBalance = Math.max(0, Number(supplier.outstandingBalance || 0) - amount);
    await supplier.save();
    await new this.cash({ transactionType: 'OUT', amount, transactionDate: payment.paymentDate, source: 'SupplierPayment', referenceId: payment._id, description: `Payment to supplier ${supplier.name}` }).save();
    return payment;
  }
  findAll() { return this.payments.find().populate('supplier').populate('purchase').sort({ paymentDate: -1 }).exec(); }
}

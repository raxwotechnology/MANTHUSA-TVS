import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentDocument } from './schemas/payment.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel('Payment') private readonly paymentModel: Model<PaymentDocument>,
    @InjectModel('Sale') private readonly saleModel: Model<any>,
    @InjectModel('CashTransaction') private readonly cashModel: Model<any>,
    private readonly notifications: NotificationsService,
  ) {}

  async create(input: any) {
    const amount = Number(input.amount);
    if (!input.sale || amount <= 0 || !Number.isFinite(amount) || !input.paymentMethod) {
      throw new BadRequestException('Sale, positive payment amount and payment method are required.');
    }
    const sale = await this.saleModel.findById(input.sale).exec();
    if (!sale) throw new NotFoundException('Sale not found.');
    const balance = Number(sale.finalAmount || 0) - Number(sale.paidAmount || 0);
    if (amount > balance) throw new BadRequestException(`Payment exceeds the outstanding balance of ${balance}.`);
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
}

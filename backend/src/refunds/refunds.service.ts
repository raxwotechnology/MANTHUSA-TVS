import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RefundsService {
  constructor(
    @InjectModel('Refund') private readonly refunds: Model<any>,
    @InjectModel('Sale') private readonly sales: Model<any>,
    @InjectModel('Reservation') private readonly reservations: Model<any>,
    @InjectModel('CashTransaction') private readonly cash: Model<any>,
  ) {}
  async create(input: any) {
    const amount = Number(input.amount);
    if (!input.customer || !Number.isFinite(amount) || amount <= 0 || (!input.sale && !input.reservation)) throw new BadRequestException('Customer, positive amount and sale or reservation are required.');
    let source: any;
    if (input.sale) {
      source = await this.sales.findById(input.sale).exec();
      if (!source) throw new NotFoundException('Sale not found.');
      if (amount > Number(source.paidAmount || 0)) throw new BadRequestException('Refund exceeds the amount paid.');
    } else {
      source = await this.reservations.findById(input.reservation).exec();
      if (!source) throw new NotFoundException('Reservation not found.');
      if (!source.isRefundable) throw new BadRequestException('This reservation deposit is not refundable.');
      if (amount > Number(source.reservationDeposit || 0)) throw new BadRequestException('Refund exceeds the reservation deposit.');
    }
    const refund = await new this.refunds({ ...input, amount, refundDate: input.refundDate || new Date(), status: 'Completed' }).save();
    if (input.sale) {
      source.paidAmount = Number(source.paidAmount || 0) - amount;
      source.balance = Math.max(0, Number(source.finalAmount || 0) - source.paidAmount);
      source.status = 'Refunded';
    } else {
      source.status = 'Cancelled'; source.refundStatus = 'Refunded';
    }
    await source.save();
    await new this.cash({ transactionType: 'OUT', amount, transactionDate: refund.refundDate, source: 'Refund', referenceId: refund._id, description: input.reason || 'Customer refund' }).save();
    return refund;
  }
  findAll() { return this.refunds.find().populate('customer').populate('sale').populate('reservation').sort({ refundDate: -1 }).exec(); }
}

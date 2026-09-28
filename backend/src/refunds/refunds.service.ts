import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

@Injectable()
export class RefundsService {
  constructor(
    @InjectModel('Refund') private readonly refunds: Model<any>,
    @InjectModel('Sale') private readonly sales: Model<any>,
    @InjectModel('Reservation') private readonly reservations: Model<any>,
    @InjectModel('CashTransaction') private readonly cash: Model<any>,
    @InjectModel('Vehicle') private readonly vehicles: Model<any>,
  ) {}
  async create(input: any) {
    const amount = Number(input.amount);
    if (!isValidObjectId(input.customer) || !Number.isFinite(amount) || amount <= 0 || Boolean(input.sale) === Boolean(input.reservation)) throw new BadRequestException('Customer, positive amount and exactly one sale or reservation are required.');
    let source: any;
    let reservationRefunded = 0;
    if (input.sale) {
      if (!isValidObjectId(input.sale)) throw new BadRequestException('Sale ID is invalid.');
      source = await this.sales.findById(input.sale).exec();
      if (!source) throw new NotFoundException('Sale not found.');
      if (source.customer.toString() !== input.customer.toString()) throw new BadRequestException('Refund customer does not match the sale.');
      if (amount > Number(source.paidAmount || 0)) throw new BadRequestException('Refund exceeds the amount paid.');
    } else {
      if (!isValidObjectId(input.reservation)) throw new BadRequestException('Reservation ID is invalid.');
      source = await this.reservations.findById(input.reservation).exec();
      if (!source) throw new NotFoundException('Reservation not found.');
      if (source.customer.toString() !== input.customer.toString()) throw new BadRequestException('Refund customer does not match the reservation.');
      if (source.status === 'ConvertedToSale') throw new BadRequestException('Refund the resulting sale instead of its converted reservation.');
      if (!source.isRefundable) throw new BadRequestException('This reservation deposit is not refundable.');
      const previousRefunds = await this.refunds.find({ reservation: source._id, status: 'Completed' }).select('amount').lean().exec();
      reservationRefunded = previousRefunds.reduce((sum: number, row: any) => sum + Number(row.amount || 0), 0);
      if (amount > Number(source.reservationDeposit || 0) - reservationRefunded) throw new BadRequestException('Refund exceeds the unrefunded reservation deposit.');
    }
    const refund = await new this.refunds({ ...input, amount, refundDate: input.refundDate || new Date(), status: 'Completed' }).save();
    if (input.sale) {
      const previouslyPaid = Number(source.paidAmount || 0);
      source.paidAmount = Number(source.paidAmount || 0) - amount;
      source.balance = Math.max(0, Number(source.finalAmount || 0) - source.paidAmount);
      if (amount >= previouslyPaid) {
        source.status = 'Refunded';
        const vehicle = await this.vehicles.findById(source.vehicle).exec();
        if (vehicle?.status === 'Sold') { vehicle.status = 'Available'; await vehicle.save(); }
      }
    } else {
      source.status = 'Cancelled';
      source.refundStatus = amount + reservationRefunded >= Number(source.reservationDeposit || 0) ? 'Refunded' : 'Partially Refunded';
      const vehicle = await this.vehicles.findById(source.vehicle).exec();
      if (vehicle?.status === 'Reserved') { vehicle.status = 'Available'; await vehicle.save(); }
    }
    await source.save();
    await new this.cash({ transactionType: 'OUT', amount, transactionDate: refund.refundDate, source: 'Refund', referenceId: refund._id, description: input.reason || 'Customer refund' }).save();
    return refund;
  }
  findAll() { return this.refunds.find().populate('customer').populate('sale').populate('reservation').sort({ refundDate: -1 }).exec(); }
}

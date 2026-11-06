import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { ReservationDocument } from './schemas/reservation.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel('Reservation') private readonly reservationModel: Model<ReservationDocument>,
    @InjectModel('Vehicle') private readonly vehicleModel: Model<any>,
    @InjectModel('Customer') private readonly customerModel: Model<any>,
    private readonly notifications: NotificationsService,
  ) {}

  async create(input: any) {
    const deposit = Number(input.reservationDeposit || 0);
    if (!isValidObjectId(input.customer) || !isValidObjectId(input.vehicle) || !input.expiryDate || deposit < 0) {
      throw new BadRequestException('Customer, motorcycle model, future expiry date and a deposit are required.');
    }
    if (!await this.customerModel.exists({ _id: input.customer })) throw new NotFoundException('Customer not found.');
    const vehicle = await this.vehicleModel.findById(input.vehicle).exec();
    if (!vehicle) throw new NotFoundException('Motorcycle not found.');

    const bookingNumber = input.bookingNumber || input.reservationId || `TVS-BK-${Date.now().toString().slice(-6)}`;
    const expiryDate = new Date(input.expiryDate);
    if (Number.isNaN(expiryDate.getTime()) || expiryDate <= new Date()) {
      throw new BadRequestException('Expiry date must be in the future.');
    }

    const isBranchValidObjId = input.branch && isValidObjectId(input.branch);
    const branch = isBranchValidObjId ? input.branch : undefined;
    const branchName = input.branchName || (!isBranchValidObjId && typeof input.branch === 'string' ? input.branch : undefined);

    const reservation = await new this.reservationModel({
      ...input,
      branch,
      ...(branchName ? { branchName } : {}),
      bookingNumber,
      reservationId: bookingNumber,
      reservationDeposit: deposit,
      modelName: input.modelName || vehicle.model,
      variantName: input.variantName || vehicle.variant,
      selectedColor: input.selectedColor || vehicle.color,
      status: 'Active',
    }).save();

    await this.notifications.create({
      title: 'TVS Booking Confirmed',
      message: `Booking ${bookingNumber} for ${vehicle.model} has been recorded.`,
      channel: 'in-app',
      entityType: 'Reservation',
      entityId: String(reservation._id),
    }).catch(() => undefined);

    // Send SMS notification to customer
    try {
      const customer = await this.customerModel.findById(input.customer).exec();
      if (customer && customer.phone) {
        const dealershipName = process.env.DEALERSHIP_NAME || 'MANTHUSA TVS';
        const agreedPrice = Number(input.agreedPrice || 0);
        const remainingBalance = agreedPrice > 0
          ? String(agreedPrice - deposit)
          : 'as per invoice';
        const expiryDateStr = expiryDate.toLocaleDateString('en-GB');
        const smsMessage = `Dear ${customer.fullName}, your ${vehicle.model} has been reserved at ${dealershipName}! Booking Ref: ${bookingNumber}. Advance Paid: LKR ${deposit}. Remaining Balance: LKR ${remainingBalance}. Please complete the full payment to confirm delivery. Expires: ${expiryDateStr}. - ${dealershipName}`;
        this.notifications.sendSms(customer.phone, smsMessage, 'Reservation').catch(() => undefined);
      }
    } catch (_) { /* SMS failure must not block reservation */ }

    return reservation;
  }

  findAll() {
    return this.reservationModel
      .find()
      .populate('customer')
      .populate('vehicle')
      .populate('branch')
      .sort({ createdAt: -1 })
      .exec();
  }

  findByCustomer(customerId: string) {
    return this.reservationModel
      .find({ customer: customerId })
      .populate('vehicle')
      .populate('branch')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string, user?: any) {
    const res = await this.reservationModel
      .findById(id)
      .populate('customer')
      .populate('vehicle')
      .populate('branch')
      .exec();
    if (!res) throw new NotFoundException(`Booking #${id} not found.`);
    const role = (user?.role || '').toLowerCase();
    if (role.includes('customer') || role.includes('client')) {
      const custId = res.customer?._id ? String(res.customer._id) : String(res.customer);
      if (user.customerId && String(user.customerId) !== custId) {
        throw new ForbiddenException('You do not have permission to view this reservation.');
      }
    }
    return res;
  }

  async update(id: string, input: any) {
    const reservation = await this.reservationModel.findById(id).exec();
    if (!reservation) throw new NotFoundException(`Booking ${id} not found.`);
    const cleanInput = { ...input };
    if (cleanInput.branch && !isValidObjectId(cleanInput.branch)) {
      if (!cleanInput.branchName && typeof cleanInput.branch === 'string') {
        cleanInput.branchName = cleanInput.branch;
      }
      delete cleanInput.branch;
    }
    Object.assign(reservation, cleanInput);
    return reservation.save();
  }

  async remove(id: string) {
    const reservation = await this.reservationModel.findByIdAndDelete(id).exec();
    if (!reservation) throw new NotFoundException(`Booking ${id} not found.`);
    return reservation;
  }
}

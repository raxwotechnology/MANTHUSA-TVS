import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

    const reservation = await new this.reservationModel({
      ...input,
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

  async findOne(id: string) {
    const res = await this.reservationModel
      .findById(id)
      .populate('customer')
      .populate('vehicle')
      .populate('branch')
      .exec();
    if (!res) throw new NotFoundException(`Booking #${id} not found.`);
    return res;
  }

  async update(id: string, input: any) {
    const reservation = await this.reservationModel.findById(id).exec();
    if (!reservation) throw new NotFoundException(`Booking ${id} not found.`);
    Object.assign(reservation, input);
    return reservation.save();
  }

  async remove(id: string) {
    const reservation = await this.reservationModel.findByIdAndDelete(id).exec();
    if (!reservation) throw new NotFoundException(`Booking ${id} not found.`);
    return reservation;
  }
}

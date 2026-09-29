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
    const deposit = Number(input.reservationDeposit);
    if (!isValidObjectId(input.customer) || !isValidObjectId(input.vehicle) || !input.expiryDate || !Number.isFinite(deposit) || deposit < 0) {
      throw new BadRequestException('Customer, vehicle, expiry date and a non-negative deposit are required.');
    }
    if (!await this.customerModel.exists({ _id: input.customer })) throw new NotFoundException('Customer not found.');
    const vehicle = await this.vehicleModel.findById(input.vehicle).exec();
    if (!vehicle) throw new NotFoundException('Vehicle not found.');
    if (vehicle.status === 'Reserved') {
      const expired = await this.reservationModel.findOne({ vehicle: vehicle._id, status: 'Active', expiryDate: { $lte: new Date() } }).exec();
      if (expired) { expired.status = 'Expired'; await expired.save(); vehicle.status = 'Available'; await vehicle.save(); }
    }
    if (vehicle.status !== 'Available') throw new BadRequestException('Only available vehicles can be reserved.');
    const expiryDate = new Date(input.expiryDate);
    if (Number.isNaN(expiryDate.getTime()) || expiryDate <= new Date()) throw new BadRequestException('Expiry date must be in the future.');
    const reservation = await new this.reservationModel({ ...input, reservationDeposit: deposit, status: 'Active', reservationId: input.reservationId || `RES-${Date.now()}` }).save();
    vehicle.status = 'Reserved';
    await vehicle.save();
    await this.notifications.create({ title: 'Vehicle reserved', message: `Vehicle ${vehicle.stockNumber} has been reserved.`, channel: 'in-app', entityType: 'Reservation', entityId: String(reservation._id) }).catch(() => undefined);
    return reservation;
  }

  findAll() {
    return this.reservationModel.find().populate('customer').populate('vehicle').sort({ createdAt: -1 }).exec();
  }

  async update(id: string, input: any) {
    const reservation = await this.reservationModel.findById(id).exec();
    if (!reservation) throw new NotFoundException(`Reservation ${id} not found.`);
    if (input.status && input.status !== reservation.status) {
      if (reservation.status !== 'Active') throw new BadRequestException('Only active reservations can change status.');
      if (!['Cancelled', 'Expired'].includes(input.status)) throw new BadRequestException('Reservations are converted to sales through the sale workflow.');
    }
    if (input.status === 'Cancelled' || input.status === 'Expired') {
      const vehicle = await this.vehicleModel.findById(reservation.vehicle).exec();
      if (vehicle?.status === 'Reserved') {
        vehicle.status = 'Available';
        await vehicle.save();
      }
    }
    Object.assign(reservation, input);
    return reservation.save();
  }

  async remove(id: string) {
    const reservation = await this.reservationModel.findByIdAndDelete(id).exec();
    if (!reservation) throw new NotFoundException(`Reservation ${id} not found.`);
    if (reservation.status === 'Active') {
      const vehicle = await this.vehicleModel.findById(reservation.vehicle).exec();
      if (vehicle?.status === 'Reserved') { vehicle.status = 'Available'; await vehicle.save(); }
    }
    return reservation;
  }
}

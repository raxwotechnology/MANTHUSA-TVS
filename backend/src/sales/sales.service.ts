import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { SaleDocument } from './schemas/sale.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class SalesService {
  constructor(
    @InjectModel('Sale') private saleModel: Model<SaleDocument>,
    @InjectModel('Vehicle') private vehicleModel: Model<any>,
    @InjectModel('Customer') private customerModel: Model<any>,
    @InjectModel('Reservation') private reservations: Model<any>,
    private readonly notifications: NotificationsService,
  ) {}

  async create(createSaleDto: any): Promise<SaleDocument> {
    if (!createSaleDto.customer || !createSaleDto.vehicle) throw new BadRequestException('Customer and vehicle are required.');
    if (!isValidObjectId(createSaleDto.customer) || !isValidObjectId(createSaleDto.vehicle)) throw new BadRequestException('Customer or vehicle ID is invalid.');
    const customer = await this.customerModel.findById(createSaleDto.customer).exec();
    if (!customer) throw new NotFoundException('Customer not found.');
    const vehicle = await this.vehicleModel.findById(createSaleDto.vehicle).exec();
    if (!vehicle) throw new NotFoundException('Vehicle not found.');
    if (!['Available', 'Reserved'].includes(vehicle.status)) throw new BadRequestException('Vehicle is not available for sale.');
    let reservation: any;
    if (vehicle.status === 'Reserved') {
      reservation = await this.reservations.findOne({ vehicle: vehicle._id, status: 'Active' }).exec();
      if (!reservation) throw new BadRequestException('This vehicle has no active reservation. Release it before recording a sale.');
      if (reservation && reservation.customer.toString() !== createSaleDto.customer.toString()) throw new BadRequestException('This vehicle is reserved for a different customer.');
      if (reservation && reservation.expiryDate <= new Date()) {
        reservation.status = 'Expired'; await reservation.save();
        vehicle.status = 'Available'; await vehicle.save();
        throw new BadRequestException('The reservation has expired. Create a new reservation before continuing.');
      }
    }
    const vehiclePrice = Number(createSaleDto.vehiclePrice ?? vehicle.sellingPrice ?? 0);
    const discount = Number(createSaleDto.discount || 0);
    const additionalCharges = Number(createSaleDto.additionalCharges || 0);
    if (vehiclePrice <= 0 || discount < 0 || discount >= vehiclePrice || additionalCharges < 0) throw new BadRequestException('Sale pricing is invalid.');
    const finalAmount = vehiclePrice - discount + additionalCharges;
    const paidAmount = Number(createSaleDto.paidAmount || 0);
    if (paidAmount < 0 || paidAmount > finalAmount) throw new BadRequestException('Paid amount must be between zero and the sale total.');
    const invoiceNumber = createSaleDto.invoiceNumber || `INV-${Date.now()}`;
    const createdSale = await new this.saleModel({
      ...createSaleDto, branch: createSaleDto.branch || vehicle.branch || vehicle.location, invoiceNumber, vehiclePrice, discount, additionalCharges,
      finalAmount, paidAmount, balance: finalAmount - paidAmount,
      status: createSaleDto.status || 'Confirmed', saleDate: createSaleDto.saleDate || new Date(),
    }).save();
    vehicle.status = 'Sold';
    vehicle.sellingPrice = vehiclePrice;
    await vehicle.save();
    if (reservation) { reservation.status = 'ConvertedToSale'; await reservation.save(); }
    await this.notifications.create({ title: 'Sale recorded', message: `Invoice ${invoiceNumber} was created.`, channel: 'in-app', entityType: 'Sale', entityId: String(createdSale._id) }).catch(() => undefined);
    return createdSale;
  }

  async findAll(): Promise<SaleDocument[]> {
    return this.saleModel.find().populate('customer').populate('vehicle').sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<SaleDocument> {
    const sale = await this.saleModel.findById(id).populate('customer').populate('vehicle').exec();
    if (!sale) {
      throw new NotFoundException(`Sale #${id} not found`);
    }
    return sale;
  }

  async update(id: string, updateSaleDto: any): Promise<SaleDocument> {
    const existingSale = await this.saleModel.findById(id).exec();
    if (!existingSale) {
      throw new NotFoundException(`Sale #${id} not found`);
    }
    const vehiclePrice = Number(updateSaleDto.vehiclePrice ?? existingSale.vehiclePrice ?? 0);
    const discount = Number(updateSaleDto.discount ?? existingSale.discount ?? 0);
    const additionalCharges = Number(updateSaleDto.additionalCharges ?? existingSale.additionalCharges ?? 0);
    if (vehiclePrice <= 0 || discount < 0 || discount >= vehiclePrice || additionalCharges < 0) {
      throw new BadRequestException('Sale pricing is invalid.');
    }
    const finalAmount = vehiclePrice - discount + additionalCharges;
    const paidAmount = Number(updateSaleDto.paidAmount ?? existingSale.paidAmount ?? 0);
    if (paidAmount < 0 || paidAmount > finalAmount) throw new BadRequestException('Paid amount cannot exceed the updated sale total.');
    Object.assign(existingSale, updateSaleDto, { vehiclePrice, discount, additionalCharges, finalAmount, paidAmount, balance: finalAmount - paidAmount });
    if (existingSale.status === 'Cancelled' || existingSale.status === 'Refunded') {
      const vehicle = await this.vehicleModel.findById(existingSale.vehicle).exec();
      if (vehicle?.status === 'Sold') { vehicle.status = 'Available'; await vehicle.save(); }
    }
    await existingSale.save();
    return existingSale;
  }

  async remove(id: string): Promise<any> {
    const deletedSale = await this.saleModel.findByIdAndDelete(id).exec();
    if (!deletedSale) {
      throw new NotFoundException(`Sale #${id} not found`);
    }
    const vehicle = await this.vehicleModel.findById(deletedSale.vehicle).exec();
    if (vehicle?.status === 'Sold') {
      vehicle.status = 'Available';
      await vehicle.save();
    }
    return deletedSale;
  }
}

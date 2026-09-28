import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VehiclePurchaseDocument } from './schemas/vehicle-purchase.schema';

@Injectable()
export class VehiclePurchasesService {
  constructor(
    @InjectModel('VehiclePurchase') private readonly purchaseModel: Model<VehiclePurchaseDocument>,
    @InjectModel('Vehicle') private readonly vehicleModel: Model<any>,
    @InjectModel('Supplier') private readonly supplierModel: Model<any>,
    @InjectModel('CashTransaction') private readonly cashTransactions: Model<any>,
  ) {}

  async create(input: any) {
    if (!input.vehicle || !input.supplier || !input.purchaseDate || Number(input.purchasePrice) <= 0) {
      throw new BadRequestException('Vehicle, supplier, purchase date and a positive purchase price are required.');
    }
    const vehicle = await this.vehicleModel.findById(input.vehicle).exec();
    if (!vehicle) throw new NotFoundException('Vehicle not found. Add the acquired vehicle to inventory first.');
    const supplier = await this.supplierModel.findById(input.supplier).exec();
    if (!supplier) throw new NotFoundException('Supplier not found.');
    const costs = Number(input.additionalCosts || 0);
    const total = Number(input.purchasePrice) + costs;
    const paidAmount = input.paymentStatus === 'Paid' ? total : Number(input.paidAmount || 0);
    if (!Number.isFinite(costs) || costs < 0 || !Number.isFinite(paidAmount) || paidAmount < 0 || paidAmount > total) throw new BadRequestException('Acquisition costs and paid amount are invalid.');
    const paymentStatus = paidAmount === total ? 'Paid' : paidAmount > 0 ? 'Partially Paid' : 'Pending';
    const purchase = await new this.purchaseModel({ ...input, additionalCosts: costs, paidAmount, paymentStatus }).save();
    vehicle.purchasePrice = Number(input.purchasePrice);
    vehicle.totalInvestment = Number(input.purchasePrice) + costs;
    if (vehicle.status === 'Available') vehicle.status = 'Purchased';
    await vehicle.save();
    supplier.outstandingBalance = Number(supplier.outstandingBalance || 0) + total - paidAmount;
    await supplier.save();
    if (paidAmount > 0) await new this.cashTransactions({ transactionType: 'OUT', amount: paidAmount, transactionDate: input.purchaseDate, source: 'SupplierPayment', referenceId: purchase._id, description: `Vehicle acquisition ${vehicle.stockNumber}` }).save();
    return purchase;
  }

  findAll() {
    return this.purchaseModel.find().populate('vehicle').populate('supplier').sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const purchase = await this.purchaseModel.findById(id).populate('vehicle').populate('supplier').exec();
    if (!purchase) throw new NotFoundException(`Purchase ${id} not found.`);
    return purchase;
  }
}

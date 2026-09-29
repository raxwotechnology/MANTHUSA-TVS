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

  async update(id: string, input: any) {
    const purchase = await this.purchaseModel.findById(id).exec();
    if (!purchase) throw new NotFoundException(`Purchase ${id} not found.`);
    const vehicleId = String(purchase.vehicle);
    const supplierId = String(purchase.supplier);
    if (input.vehicle && String(input.vehicle) !== vehicleId) throw new BadRequestException('The vehicle linked to an acquisition cannot be changed.');
    if (input.supplier && String(input.supplier) !== supplierId) throw new BadRequestException('The supplier linked to an acquisition cannot be changed.');

    const purchasePrice = Number(input.purchasePrice ?? purchase.purchasePrice);
    const additionalCosts = Number(input.additionalCosts ?? purchase.additionalCosts ?? 0);
    const paidAmount = Number(input.paidAmount ?? purchase.paidAmount ?? 0);
    const total = purchasePrice + additionalCosts;
    if (!Number.isFinite(purchasePrice) || purchasePrice <= 0 || !Number.isFinite(additionalCosts) || additionalCosts < 0 || !Number.isFinite(paidAmount) || paidAmount < 0 || paidAmount > total) {
      throw new BadRequestException('Acquisition costs and paid amount are invalid.');
    }

    const vehicle = await this.vehicleModel.findById(purchase.vehicle).exec();
    const supplier = await this.supplierModel.findById(purchase.supplier).exec();
    if (!vehicle || !supplier) throw new NotFoundException('The vehicle or supplier linked to this acquisition no longer exists.');

    const previousTotal = Number(purchase.purchasePrice || 0) + Number(purchase.additionalCosts || 0);
    const previousPaid = Number(purchase.paidAmount || 0);
    const supplierOutstanding = Math.max(0, Number(supplier.outstandingBalance || 0) + (total - paidAmount) - (previousTotal - previousPaid));
    vehicle.purchasePrice = purchasePrice;
    vehicle.totalInvestment = Math.max(0, Number(vehicle.totalInvestment || previousTotal) + total - previousTotal);

    const paymentStatus = paidAmount === total ? 'Paid' : paidAmount > 0 ? 'Partially Paid' : 'Pending';
    Object.assign(purchase, input, { vehicle: purchase.vehicle, supplier: purchase.supplier, purchasePrice, additionalCosts, paidAmount, paymentStatus });
    await Promise.all([
      purchase.save(),
      this.supplierModel.updateOne({ _id: supplier._id }, { $set: { outstandingBalance: supplierOutstanding } }).exec(),
      vehicle.save(),
    ]);

    const payment = await this.cashTransactions.findOne({ source: 'SupplierPayment', referenceId: purchase._id }).exec();
    if (paidAmount > 0) {
      const transactionData = { transactionType: 'OUT', amount: paidAmount, transactionDate: purchase.purchaseDate, source: 'SupplierPayment', referenceId: purchase._id, description: `Vehicle acquisition ${vehicle.stockNumber}` };
      if (payment) { Object.assign(payment, transactionData); await payment.save(); }
      else await new this.cashTransactions(transactionData).save();
    } else if (payment) {
      await payment.deleteOne();
    }
    return purchase;
  }

  async remove(id: string) {
    const purchase = await this.purchaseModel.findById(id).exec();
    if (!purchase) throw new NotFoundException(`Purchase ${id} not found.`);
    const total = Number(purchase.purchasePrice || 0) + Number(purchase.additionalCosts || 0);
    const unpaid = Math.max(0, total - Number(purchase.paidAmount || 0));
    const [vehicle, supplier] = await Promise.all([
      this.vehicleModel.findById(purchase.vehicle).exec(),
      this.supplierModel.findById(purchase.supplier).exec(),
    ]);
    if (supplier) {
      const outstandingBalance = Math.max(0, Number(supplier.outstandingBalance || 0) - unpaid);
      await this.supplierModel.updateOne({ _id: supplier._id }, { $set: { outstandingBalance } }).exec();
    }
    if (vehicle) {
      vehicle.purchasePrice = Math.max(0, Number(vehicle.purchasePrice || 0) - Number(purchase.purchasePrice || 0));
      vehicle.totalInvestment = Math.max(0, Number(vehicle.totalInvestment || 0) - total);
      if (vehicle.status === 'Purchased') vehicle.status = 'Available';
      await vehicle.save();
    }
    await this.cashTransactions.deleteMany({ source: 'SupplierPayment', referenceId: purchase._id }).exec();
    await purchase.deleteOne();
    return purchase;
  }
}

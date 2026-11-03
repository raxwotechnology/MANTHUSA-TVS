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
    if (!createSaleDto.customer || !createSaleDto.vehicle) throw new BadRequestException('Customer and motorcycle model are required.');
    if (!isValidObjectId(createSaleDto.customer) || !isValidObjectId(createSaleDto.vehicle)) throw new BadRequestException('Customer or motorcycle ID is invalid.');
    const customer = await this.customerModel.findById(createSaleDto.customer).exec();
    if (!customer) throw new NotFoundException('Customer not found.');
    const vehicle = await this.vehicleModel.findById(createSaleDto.vehicle).exec();
    if (!vehicle) throw new NotFoundException('Motorcycle not found.');

    const vehiclePrice = Number(createSaleDto.vehiclePrice ?? vehicle.sellingPrice ?? 0);
    const discount = Number(createSaleDto.discount || 0);
    const additionalCharges = Number(createSaleDto.additionalCharges || 0);
    const registrationFee = Number(createSaleDto.registrationFee || 0);
    const insuranceFee = Number(createSaleDto.insuranceFee || 0);
    if (vehiclePrice <= 0 || discount < 0 || discount >= vehiclePrice || additionalCharges < 0) throw new BadRequestException('Sale pricing is invalid.');
    const finalAmount = Math.max(0, vehiclePrice - discount + registrationFee + insuranceFee + additionalCharges);
    const paidAmount = Number(createSaleDto.paidAmount || 0);
    if (paidAmount < 0 || paidAmount > finalAmount) throw new BadRequestException('Paid amount must be between zero and the invoice total.');

    const invoiceNumber = createSaleDto.invoiceNumber || `TVS-INV-${Date.now().toString().slice(-6)}`;
    const contractNumber = createSaleDto.salesContractNumber || `TVS-CNT-${Date.now().toString().slice(-6)}`;

    const createdSale = await new this.saleModel({
      ...createSaleDto,
      branch: createSaleDto.branch || vehicle.branch || vehicle.location,
      branchName: createSaleDto.branchName,
      modelName: createSaleDto.modelName || vehicle.model,
      variantName: createSaleDto.variantName || vehicle.variant,
      selectedColor: createSaleDto.selectedColor || vehicle.color,
      invoiceNumber,
      salesContractNumber: contractNumber,
      vehiclePrice,
      discount,
      registrationFee,
      insuranceFee,
      additionalCharges,
      finalAmount,
      paidAmount,
      balance: Math.max(0, finalAmount - paidAmount),
      status: createSaleDto.status || (paidAmount >= finalAmount ? 'Paid in Full' : paidAmount > 0 ? 'Partially Paid' : 'Pending'),
      saleDate: createSaleDto.saleDate || new Date(),
    }).save();

    await this.notifications.create({
      title: 'TVS Sale Recorded',
      message: `Invoice ${invoiceNumber} created for ${vehicle.model}.`,
      channel: 'in-app',
      entityType: 'Sale',
      entityId: String(createdSale._id)
    }).catch(() => undefined);

    return createdSale;
  }

  async findAll(): Promise<SaleDocument[]> {
    return this.saleModel
      .find()
      .populate('customer')
      .populate('vehicle')
      .populate('branch')
      .populate('quotation')
      .populate('booking')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByCustomer(customerId: string): Promise<SaleDocument[]> {
    return this.saleModel
      .find({ customer: customerId })
      .populate('vehicle')
      .populate('branch')
      .populate('quotation')
      .populate('booking')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<SaleDocument> {
    const sale = await this.saleModel
      .findById(id)
      .populate('customer')
      .populate('vehicle')
      .populate('branch')
      .populate('quotation')
      .populate('booking')
      .exec();
    if (!sale) {
      throw new NotFoundException(`Invoice #${id} not found`);
    }
    return sale;
  }

  async update(id: string, updateSaleDto: any): Promise<SaleDocument> {
    const existingSale = await this.saleModel.findById(id).exec();
    if (!existingSale) {
      throw new NotFoundException(`Invoice #${id} not found`);
    }
    const vehiclePrice = Number(updateSaleDto.vehiclePrice ?? existingSale.vehiclePrice ?? 0);
    const discount = Number(updateSaleDto.discount ?? existingSale.discount ?? 0);
    const additionalCharges = Number(updateSaleDto.additionalCharges ?? existingSale.additionalCharges ?? 0);
    const registrationFee = Number(updateSaleDto.registrationFee ?? existingSale.registrationFee ?? 0);
    const insuranceFee = Number(updateSaleDto.insuranceFee ?? existingSale.insuranceFee ?? 0);
    if (vehiclePrice <= 0 || discount < 0 || discount >= vehiclePrice || additionalCharges < 0) {
      throw new BadRequestException('Invoice pricing is invalid.');
    }
    const finalAmount = vehiclePrice - discount + registrationFee + insuranceFee + additionalCharges;
    const paidAmount = Number(updateSaleDto.paidAmount ?? existingSale.paidAmount ?? 0);
    if (paidAmount < 0 || paidAmount > finalAmount) throw new BadRequestException('Paid amount cannot exceed the updated invoice total.');
    const balance = Math.max(0, finalAmount - paidAmount);
    const status = updateSaleDto.status || (paidAmount >= finalAmount ? 'Paid in Full' : paidAmount > 0 ? 'Partially Paid' : 'Pending');

    Object.assign(existingSale, updateSaleDto, {
      vehiclePrice,
      discount,
      registrationFee,
      insuranceFee,
      additionalCharges,
      finalAmount,
      paidAmount,
      balance,
      status,
    });

    await existingSale.save();
    return existingSale;
  }

  async getSalesContract(id: string) {
    const sale = await this.findOne(id);
    const customer = (sale.customer || {}) as any;
    const vehicle = (sale.vehicle || {}) as any;

    return {
      contractNumber: sale.salesContractNumber || `TVS-CNT-${id.slice(-6)}`,
      invoiceNumber: sale.invoiceNumber,
      date: sale.saleDate || (sale as any).createdAt,
      customer: {
        name: customer.fullName || 'Customer',
        nic: customer.nicOrPassport || 'N/A',
        phone: customer.phone || 'N/A',
        address: customer.address || 'N/A',
      },
      motorcycle: {
        make: vehicle.make || 'TVS',
        model: sale.modelName || vehicle.model || 'TVS Motorcycle',
        variant: sale.variantName || vehicle.variant || 'Standard',
        color: sale.selectedColor || vehicle.color || 'Standard',
        chassisNumber: sale.chassisNumber || vehicle.chassisNumber || 'Pending Allocation',
        engineNumber: sale.engineNumber || vehicle.engineNumber || 'Pending Allocation',
      },
      financials: {
        basePrice: sale.vehiclePrice,
        discount: sale.discount,
        registrationFee: sale.registrationFee || 0,
        insuranceFee: sale.insuranceFee || 0,
        additionalCharges: sale.additionalCharges,
        total: sale.finalAmount,
        paid: sale.paidAmount,
        balance: sale.balance,
      },
      terms: 'Official 5-Year / 70,000 km TVS Warranty. Delivery subject to full payment settlement and registration documentation.'
    };
  }

  async remove(id: string): Promise<any> {
    const deletedSale = await this.saleModel.findByIdAndDelete(id).exec();
    if (!deletedSale) {
      throw new NotFoundException(`Invoice #${id} not found`);
    }
    return deletedSale;
  }
}

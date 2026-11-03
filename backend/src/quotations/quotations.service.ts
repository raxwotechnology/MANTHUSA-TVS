import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuotationDocument } from './schemas/quotation.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class QuotationsService {
  constructor(
    @InjectModel('Quotation') private quotationModel: Model<QuotationDocument>,
    @InjectModel('Sale') private saleModel: Model<any>,
    @InjectModel('Reservation') private reservationModel: Model<any>,
    @InjectModel('Vehicle') private vehicleModel: Model<any>,
    private readonly notifications: NotificationsService,
  ) {}

  async create(createQuotationDto: any): Promise<QuotationDocument> {
    if (!createQuotationDto.customer || !createQuotationDto.vehicle) {
      throw new BadRequestException('Customer and motorcycle model are required.');
    }
    const vehiclePrice = Number(createQuotationDto.vehiclePrice || 0);
    const discount = Number(createQuotationDto.discount || 0);
    const registrationFee = Number(createQuotationDto.registrationFee || 0);
    const insuranceFee = Number(createQuotationDto.insuranceFee || 0);
    const otherCharges = Number(createQuotationDto.otherCharges || createQuotationDto.additionalCharges || 0);
    if (vehiclePrice <= 0 || discount < 0 || discount >= vehiclePrice) {
      throw new BadRequestException('Quotation pricing is invalid.');
    }
    const quotationNumber = createQuotationDto.quotationNumber || `TVS-QT-${Date.now().toString().slice(-6)}`;
    const totalAmount = vehiclePrice - discount + registrationFee + insuranceFee + otherCharges;

    const createdQuotation = new this.quotationModel({
      ...createQuotationDto,
      quotationNumber,
      vehiclePrice,
      discount,
      registrationFee,
      insuranceFee,
      otherCharges,
      totalAmount,
      validUntil: createQuotationDto.validUntil || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: createQuotationDto.status || 'Sent',
    });
    const saved = await createdQuotation.save();
    await this.notifications.create({
      title: 'Quotation Generated',
      message: `Quotation ${quotationNumber} has been generated for amount LKR ${totalAmount.toLocaleString()}.`,
      channel: 'in-app',
      entityType: 'Quotation',
      entityId: String(saved._id),
    }).catch(() => undefined);
    return saved;
  }

  async findAll(): Promise<QuotationDocument[]> {
    return this.quotationModel
      .find()
      .populate('customer')
      .populate('vehicle')
      .populate('booking')
      .populate('branch')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByCustomer(customerId: string): Promise<QuotationDocument[]> {
    return this.quotationModel
      .find({ customer: customerId })
      .populate('vehicle')
      .populate('booking')
      .populate('branch')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<QuotationDocument> {
    const quotation = await this.quotationModel
      .findById(id)
      .populate('customer')
      .populate('vehicle')
      .populate('booking')
      .populate('branch')
      .exec();
    if (!quotation) {
      throw new NotFoundException(`Quotation #${id} not found`);
    }
    return quotation;
  }

  async acceptQuotation(id: string, customerId?: string): Promise<QuotationDocument> {
    const quotation = await this.quotationModel.findById(id).exec();
    if (!quotation) throw new NotFoundException(`Quotation #${id} not found`);
    if (customerId && String(quotation.customer) !== String(customerId)) {
      throw new BadRequestException('You are not authorized to accept this quotation.');
    }
    if (quotation.status === 'Converted to Invoice') {
      throw new BadRequestException('Quotation has already been converted to an invoice.');
    }
    quotation.status = 'Accepted';
    quotation.acceptedAt = new Date();
    const saved = await quotation.save();
    await this.notifications.create({
      title: 'Quotation Accepted',
      message: `Quotation ${quotation.quotationNumber} was accepted by the customer.`,
      channel: 'in-app',
      entityType: 'Quotation',
      entityId: String(saved._id),
    }).catch(() => undefined);
    return saved;
  }

  async rejectQuotation(id: string, reason: string, customerId?: string): Promise<QuotationDocument> {
    const quotation = await this.quotationModel.findById(id).exec();
    if (!quotation) throw new NotFoundException(`Quotation #${id} not found`);
    if (customerId && String(quotation.customer) !== String(customerId)) {
      throw new BadRequestException('You are not authorized to reject this quotation.');
    }
    quotation.status = 'Rejected';
    quotation.rejectedAt = new Date();
    quotation.rejectionReason = reason || 'Customer requested changes';
    return quotation.save();
  }

  async convertToInvoice(id: string, staffUser?: any): Promise<any> {
    const quotation = await this.quotationModel.findById(id).populate('vehicle').populate('customer').exec();
    if (!quotation) throw new NotFoundException(`Quotation #${id} not found`);

    if (quotation.status !== 'Accepted') {
      // Auto-accept if staff explicitly converts
      quotation.status = 'Accepted';
      quotation.acceptedAt = quotation.acceptedAt || new Date();
    }

    // Check for existing invoice
    const existingInvoice = await this.saleModel.findOne({ quotation: quotation._id }).exec();
    if (existingInvoice) {
      return { sale: existingInvoice, message: 'Invoice already created for this quotation.' };
    }

    const invoiceNumber = `TVS-INV-${Date.now().toString().slice(-6)}`;
    const contractNumber = `TVS-CNT-${Date.now().toString().slice(-6)}`;
    const vehicle = quotation.vehicle as any;

    const finalAmount = quotation.totalAmount || (quotation.vehiclePrice - quotation.discount + (quotation.registrationFee || 0) + (quotation.insuranceFee || 0) + (quotation.otherCharges || 0));
    const advancePaid = Number(quotation.advancePayment || 0);

    const sale = new this.saleModel({
      invoiceNumber,
      salesContractNumber: contractNumber,
      customer: quotation.customer?._id || quotation.customer,
      vehicle: quotation.vehicle?._id || quotation.vehicle,
      quotation: quotation._id,
      booking: quotation.booking,
      salesperson: staffUser?._id || staffUser?.sub || quotation.salesperson,
      branch: quotation.branch || vehicle?.branch || vehicle?.location,
      branchName: quotation.branchName,
      modelName: quotation.modelName || vehicle?.model,
      variantName: quotation.variantName || vehicle?.variant,
      selectedColor: quotation.selectedColor || vehicle?.color,
      vehiclePrice: quotation.vehiclePrice,
      discount: quotation.discount,
      registrationFee: quotation.registrationFee,
      insuranceFee: quotation.insuranceFee,
      additionalCharges: quotation.otherCharges,
      finalAmount,
      paidAmount: advancePaid,
      balance: Math.max(0, finalAmount - advancePaid),
      status: advancePaid >= finalAmount ? 'Paid in Full' : advancePaid > 0 ? 'Partially Paid' : 'Pending',
      saleDate: new Date(),
    });

    const savedSale = await sale.save();
    quotation.status = 'Converted to Invoice';
    await quotation.save();

    if (quotation.booking) {
      await this.reservationModel.findByIdAndUpdate(quotation.booking, { status: 'Invoiced' }).exec().catch(() => undefined);
    }

    await this.notifications.create({
      title: 'Invoice Created',
      message: `Quotation ${quotation.quotationNumber} converted to Invoice ${invoiceNumber}.`,
      channel: 'in-app',
      entityType: 'Sale',
      entityId: String(savedSale._id),
    }).catch(() => undefined);

    return { sale: savedSale, quotation };
  }

  async update(id: string, updateQuotationDto: any): Promise<QuotationDocument> {
    const quotation = await this.quotationModel.findById(id).exec();
    if (!quotation) throw new NotFoundException(`Quotation #${id} not found`);

    const vehiclePrice = Number(updateQuotationDto.vehiclePrice ?? quotation.vehiclePrice ?? 0);
    const discount = Number(updateQuotationDto.discount ?? quotation.discount ?? 0);
    const registrationFee = Number(updateQuotationDto.registrationFee ?? quotation.registrationFee ?? 0);
    const insuranceFee = Number(updateQuotationDto.insuranceFee ?? quotation.insuranceFee ?? 0);
    const otherCharges = Number(updateQuotationDto.otherCharges ?? updateQuotationDto.additionalCharges ?? quotation.otherCharges ?? 0);
    const advancePayment = Number(updateQuotationDto.advancePayment ?? quotation.advancePayment ?? 0);
    if (vehiclePrice <= 0 || discount < 0 || discount >= vehiclePrice || registrationFee < 0 || insuranceFee < 0 || otherCharges < 0) {
      throw new BadRequestException('Quotation pricing is invalid.');
    }
    const totalAmount = vehiclePrice - discount + registrationFee + insuranceFee + otherCharges;
    if (advancePayment < 0 || advancePayment > totalAmount) {
      throw new BadRequestException('Advance payment must be between zero and the quotation total.');
    }

    Object.assign(quotation, updateQuotationDto, {
      vehiclePrice,
      discount,
      registrationFee,
      insuranceFee,
      otherCharges,
      advancePayment,
      totalAmount,
    });
    return quotation.save();
  }

  async remove(id: string): Promise<any> {
    const deletedQuotation = await this.quotationModel.findByIdAndDelete(id).exec();
    if (!deletedQuotation) {
      throw new NotFoundException(`Quotation #${id} not found`);
    }
    return deletedQuotation;
  }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuotationDocument } from './schemas/quotation.schema';

@Injectable()
export class QuotationsService {
  constructor(
    @InjectModel('Quotation') private quotationModel: Model<QuotationDocument>
  ) {}

  async create(createQuotationDto: any): Promise<QuotationDocument> {
    if (!createQuotationDto.customer || !createQuotationDto.vehicle) throw new BadRequestException('Customer and vehicle are required.');
    const vehiclePrice = Number(createQuotationDto.vehiclePrice || 0);
    const discount = Number(createQuotationDto.discount || 0);
    const registrationFee = Number(createQuotationDto.registrationFee || 0);
    const insuranceFee = Number(createQuotationDto.insuranceFee || 0);
    const otherCharges = Number(createQuotationDto.otherCharges || createQuotationDto.additionalCharges || 0);
    if (vehiclePrice <= 0 || discount < 0 || discount >= vehiclePrice) throw new BadRequestException('Quotation pricing is invalid.');
    const createdQuotation = new this.quotationModel({
      ...createQuotationDto,
      quotationNumber: createQuotationDto.quotationNumber || `QT-${Date.now()}`,
      vehiclePrice, discount, registrationFee, insuranceFee, otherCharges,
      totalAmount: vehiclePrice - discount + registrationFee + insuranceFee + otherCharges,
    });
    return createdQuotation.save();
  }

  async findAll(): Promise<QuotationDocument[]> {
    return this.quotationModel.find().populate('customer').populate('vehicle').sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<QuotationDocument> {
    const quotation = await this.quotationModel.findById(id).populate('customer').populate('vehicle').exec();
    if (!quotation) {
      throw new NotFoundException(`Quotation #${id} not found`);
    }
    return quotation;
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
    if (advancePayment < 0 || advancePayment > totalAmount) throw new BadRequestException('Advance payment must be between zero and the quotation total.');

    Object.assign(quotation, updateQuotationDto, {
      vehiclePrice, discount, registrationFee, insuranceFee, otherCharges, advancePayment,
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

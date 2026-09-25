import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuotationDocument } from './schemas/quotation.schema';

@Injectable()
export class QuotationsService {
  constructor(
    @InjectModel('Quotation') private quotationModel: Model<QuotationDocument>
  ) {}

  async create(createQuotationDto: any): Promise<QuotationDocument> {
    const createdQuotation = new this.quotationModel(createQuotationDto);
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
    const existingQuotation = await this.quotationModel.findByIdAndUpdate(
      id,
      updateQuotationDto,
      { new: true }
    ).exec();
    if (!existingQuotation) {
      throw new NotFoundException(`Quotation #${id} not found`);
    }
    return existingQuotation;
  }

  async remove(id: string): Promise<any> {
    const deletedQuotation = await this.quotationModel.findByIdAndDelete(id).exec();
    if (!deletedQuotation) {
      throw new NotFoundException(`Quotation #${id} not found`);
    }
    return deletedQuotation;
  }
}

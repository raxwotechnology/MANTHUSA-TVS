import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SaleDocument } from './schemas/sale.schema';

@Injectable()
export class SalesService {
  constructor(
    @InjectModel('Sale') private saleModel: Model<SaleDocument>
  ) {}

  async create(createSaleDto: any): Promise<SaleDocument> {
    const createdSale = new this.saleModel(createSaleDto);
    return createdSale.save();
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
    const existingSale = await this.saleModel.findByIdAndUpdate(
      id,
      updateSaleDto,
      { new: true }
    ).exec();
    if (!existingSale) {
      throw new NotFoundException(`Sale #${id} not found`);
    }
    return existingSale;
  }

  async remove(id: string): Promise<any> {
    const deletedSale = await this.saleModel.findByIdAndDelete(id).exec();
    if (!deletedSale) {
      throw new NotFoundException(`Sale #${id} not found`);
    }
    return deletedSale;
  }
}

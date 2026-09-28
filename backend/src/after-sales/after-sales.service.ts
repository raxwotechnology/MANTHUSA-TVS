import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AfterSalesService {
  constructor(@InjectModel('AfterSales') private readonly model: Model<any>) {}
  create(input: any) { return new this.model(input).save(); }
  findAll() { return this.model.find().populate('sale').populate('customer').sort({ nextFollowUp: 1 }).exec(); }
  async update(id: string, input: any) {
    const item = await this.model.findByIdAndUpdate(id, input, { new: true, runValidators: true }).exec();
    if (!item) throw new NotFoundException(`After-sales record ${id} not found.`);
    return item;
  }
}

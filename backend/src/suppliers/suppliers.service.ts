import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SuppliersService {
  constructor(@InjectModel('Supplier') private readonly model: Model<any>) {}
  create(input: any) { return new this.model({ ...input, supplierId: input.supplierId || `SUP-${Date.now()}` }).save(); }
  findAll() { return this.model.find().sort({ name: 1 }).exec(); }
  async update(id: string, input: any) {
    const item = await this.model.findByIdAndUpdate(id, input, { new: true, runValidators: true }).exec();
    if (!item) throw new NotFoundException(`Supplier ${id} not found.`);
    return item;
  }
  async remove(id: string) {
    const item = await this.model.findByIdAndDelete(id).exec();
    if (!item) throw new NotFoundException(`Supplier ${id} not found.`);
    return item;
  }
}

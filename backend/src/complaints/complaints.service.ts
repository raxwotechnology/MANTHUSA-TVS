import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ComplaintsService {
  constructor(@InjectModel('Complaint') private readonly model: Model<any>) {}
  create(input: any) { return new this.model(input).save(); }
  findAll() { return this.model.find().populate('customer').populate('vehicle').populate('sale').populate('assignedStaff', 'name').sort({ createdAt: -1 }).exec(); }
  async update(id: string, input: any) {
    const item = await this.model.findByIdAndUpdate(id, input, { new: true, runValidators: true }).exec();
    if (!item) throw new NotFoundException(`Complaint ${id} not found.`);
    return item;
  }
  async remove(id: string) {
    const item = await this.model.findByIdAndDelete(id).exec();
    if (!item) throw new NotFoundException(`Complaint ${id} not found.`);
    return item;
  }
}

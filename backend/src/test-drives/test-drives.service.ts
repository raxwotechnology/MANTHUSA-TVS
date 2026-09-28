import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TestDrivesService {
  constructor(@InjectModel('TestDrive') private readonly model: Model<any>) {}
  create(input: any) {
    if (!input.customer || !input.vehicle || !input.salesperson || !input.date) throw new BadRequestException('Customer, vehicle, salesperson and date are required.');
    return new this.model(input).save();
  }
  findAll() { return this.model.find().populate('customer').populate('vehicle').populate('salesperson').sort({ date: 1 }).exec(); }
  async update(id: string, input: any) {
    const item = await this.model.findByIdAndUpdate(id, input, { new: true, runValidators: true }).exec();
    if (!item) throw new NotFoundException(`Test drive ${id} not found.`);
    return item;
  }
}

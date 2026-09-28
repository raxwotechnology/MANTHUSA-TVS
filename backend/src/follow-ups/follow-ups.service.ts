import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class FollowUpsService {
  constructor(@InjectModel('FollowUp') private readonly model: Model<any>) {}
  create(input: any) {
    if (!input.customer || !input.followUpDate || !input.type) throw new BadRequestException('Customer, date and follow-up type are required.');
    return new this.model(input).save();
  }
  findAll() { return this.model.find().populate('customer').populate('vehicle').populate('lead').sort({ followUpDate: 1 }).exec(); }
  async update(id: string, input: any) {
    const item = await this.model.findByIdAndUpdate(id, input, { new: true, runValidators: true }).exec();
    if (!item) throw new NotFoundException(`Follow-up ${id} not found.`);
    return item;
  }
}

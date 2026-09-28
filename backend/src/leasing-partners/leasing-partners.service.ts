import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LeasingPartnerDocument } from './schemas/leasing-partner.schema';

@Injectable()
export class LeasingPartnersService {
  constructor(
    @InjectModel('LeasingPartner') private leasingPartnerModel: Model<LeasingPartnerDocument>,
  ) {}

  async create(dto: any) {
    const record = new this.leasingPartnerModel(dto);
    return record.save();
  }

  async findAll() {
    return this.leasingPartnerModel.find().exec();
  }

  async update(id: string, dto: any) {
    return this.leasingPartnerModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async remove(id: string) {
    return this.leasingPartnerModel.findByIdAndDelete(id).exec();
  }
}

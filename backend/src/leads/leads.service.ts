import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LeadDocument } from './schemas/lead.schema';

@Injectable()
export class LeadsService {
  constructor(
    @InjectModel('Lead') private leadModel: Model<LeadDocument>
  ) {}

  async create(createLeadDto: any): Promise<LeadDocument> {
    const createdLead = new this.leadModel(createLeadDto);
    return createdLead.save();
  }

  async findAll(): Promise<LeadDocument[]> {
    return this.leadModel.find().populate('customer').sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<LeadDocument> {
    const lead = await this.leadModel.findById(id).populate('customer').exec();
    if (!lead) {
      throw new NotFoundException(`Lead #${id} not found`);
    }
    return lead;
  }

  async update(id: string, updateLeadDto: any): Promise<LeadDocument> {
    const existingLead = await this.leadModel.findByIdAndUpdate(
      id,
      updateLeadDto,
      { new: true }
    ).exec();
    if (!existingLead) {
      throw new NotFoundException(`Lead #${id} not found`);
    }
    return existingLead;
  }

  async remove(id: string): Promise<any> {
    const deletedLead = await this.leadModel.findByIdAndDelete(id).exec();
    if (!deletedLead) {
      throw new NotFoundException(`Lead #${id} not found`);
    }
    return deletedLead;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VehicleValuationDocument } from './schemas/vehicle-valuation.schema';

@Injectable()
export class VehicleValuationsService {
  constructor(
    @InjectModel('VehicleValuation') private valuationModel: Model<VehicleValuationDocument>
  ) {}

  async create(createDto: any): Promise<VehicleValuationDocument> {
    const created = new this.valuationModel(createDto);
    return created.save();
  }

  async findAll(): Promise<VehicleValuationDocument[]> {
    return this.valuationModel.find().exec();
  }

  async findOne(id: string): Promise<VehicleValuationDocument> {
    const item = await this.valuationModel.findById(id).exec();
    if (!item) throw new NotFoundException(`Valuation #${id} not found`);
    return item;
  }

  async update(id: string, updateDto: any): Promise<VehicleValuationDocument> {
    const item = await this.valuationModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    if (!item) throw new NotFoundException(`Valuation #${id} not found`);
    return item;
  }

  async remove(id: string): Promise<any> {
    const item = await this.valuationModel.findByIdAndDelete(id).exec();
    if (!item) throw new NotFoundException(`Valuation #${id} not found`);
    return item;
  }
}

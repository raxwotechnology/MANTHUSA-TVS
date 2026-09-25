import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VehicleTransferDocument } from './schemas/vehicle-transfer.schema';

@Injectable()
export class VehicleTransfersService {
  constructor(
    @InjectModel('VehicleTransfer') private transferModel: Model<VehicleTransferDocument>
  ) {}

  async create(createDto: any): Promise<VehicleTransferDocument> {
    const created = new this.transferModel(createDto);
    return created.save();
  }

  async findAll(): Promise<VehicleTransferDocument[]> {
    return this.transferModel.find().populate('vehicle').populate('fromBranch').populate('toBranch').exec();
  }

  async findOne(id: string): Promise<VehicleTransferDocument> {
    const item = await this.transferModel.findById(id).populate('vehicle').populate('fromBranch').populate('toBranch').exec();
    if (!item) throw new NotFoundException(`Transfer #${id} not found`);
    return item;
  }

  async update(id: string, updateDto: any): Promise<VehicleTransferDocument> {
    const item = await this.transferModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    if (!item) throw new NotFoundException(`Transfer #${id} not found`);
    return item;
  }

  async remove(id: string): Promise<any> {
    const item = await this.transferModel.findByIdAndDelete(id).exec();
    if (!item) throw new NotFoundException(`Transfer #${id} not found`);
    return item;
  }
}

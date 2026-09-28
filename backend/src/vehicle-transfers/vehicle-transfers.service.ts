import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VehicleTransferDocument } from './schemas/vehicle-transfer.schema';

@Injectable()
export class VehicleTransfersService {
  constructor(
    @InjectModel('VehicleTransfer') private transferModel: Model<VehicleTransferDocument>,
    @InjectModel('Vehicle') private vehicleModel: Model<any>,
  ) {}

  async create(createDto: any): Promise<VehicleTransferDocument> {
    if (!createDto.vehicle || !createDto.fromBranch || !createDto.toBranch || createDto.fromBranch === createDto.toBranch) throw new BadRequestException('Vehicle and two different branches are required.');
    const vehicle = await this.vehicleModel.findById(createDto.vehicle).exec();
    if (!vehicle) throw new NotFoundException('Vehicle not found.');
    const currentBranch = vehicle.branch || vehicle.location;
    if (currentBranch && String(currentBranch) !== String(createDto.fromBranch)) throw new BadRequestException('Vehicle is not currently assigned to the selected source branch.');
    const created = new this.transferModel({ ...createDto, transferId: createDto.transferId || `TRF-${Date.now()}`, status: 'Pending' });
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
    const item = await this.transferModel.findById(id).exec();
    if (!item) throw new NotFoundException(`Transfer #${id} not found`);
    if (updateDto.status === 'Completed') {
      const vehicle = await this.vehicleModel.findById(item.vehicle).exec();
      if (!vehicle) throw new NotFoundException('Vehicle not found.');
      vehicle.location = item.toBranch as any;
      vehicle.branch = item.toBranch as any;
      await vehicle.save();
    }
    Object.assign(item, updateDto);
    await item.save();
    return item;
  }

  async remove(id: string): Promise<any> {
    const item = await this.transferModel.findByIdAndDelete(id).exec();
    if (!item) throw new NotFoundException(`Transfer #${id} not found`);
    return item;
  }
}

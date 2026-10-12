import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class VehicleInspectionsService {
  constructor(
    @InjectModel('VehicleInspection') private readonly inspections: Model<any>,
    @InjectModel('Vehicle') private readonly vehicles: Model<any>,
  ) {}
  async create(input: any) {
    if (!input.vehicle) throw new BadRequestException('Vehicle is required.');
    const vehicle = await this.vehicles.findById(input.vehicle).exec();
    if (!vehicle) throw new NotFoundException('Vehicle not found.');
    const inspection = await new this.inspections(input).save();
    vehicle.status = input.result === 'Failed' ? 'Under Repair' : (input.result === 'Passed' || input.result === 'Passed with Issues') ? 'Available' : 'Under Inspection';
    await vehicle.save();
    return inspection;
  }
  findAll() { return this.inspections.find().populate('vehicle').populate('inspector').sort({ createdAt: -1 }).exec(); }
  async update(id: string, input: any) {
    const item = await this.inspections.findByIdAndUpdate(id, input, { new: true, runValidators: true }).exec();
    if (!item) throw new NotFoundException(`Inspection ${id} not found.`);
    if (input.result) {
      const vehicle = await this.vehicles.findById(item.vehicle).exec();
      if (vehicle) {
        vehicle.status = (input.result === 'Passed' || input.result === 'Passed with Issues') ? 'Available' : input.result === 'Failed' ? 'Under Repair' : 'Under Inspection';
        await vehicle.save();
      }
    }
    return item;
  }
  async remove(id: string) {
    const item = await this.inspections.findByIdAndDelete(id).exec();
    if (!item) throw new NotFoundException(`Inspection ${id} not found.`);
    const vehicle = await this.vehicles.findById(item.vehicle).exec();
    if (vehicle && ['Under Inspection', 'Under Repair'].includes(vehicle.status)) {
      vehicle.status = 'Available';
      await vehicle.save();
    }
    return item;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VehicleDocument } from './schemas/vehicle.schema';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel('Vehicle') private vehicleModel: Model<VehicleDocument>
  ) {}

  async create(createVehicleDto: any): Promise<VehicleDocument> {
    const createdVehicle = new this.vehicleModel(createVehicleDto);
    return createdVehicle.save();
  }

  async findAll(): Promise<VehicleDocument[]> {
    return this.vehicleModel.find().exec();
  }

  findPublicListings() {
    return this.vehicleModel.find({ status: 'Available' }).select('make model variant year manufacturingYear registeredYear vehicleType condition fuelType transmission driveType engineCapacity mileage color sellingPrice images status').sort({ createdAt: -1 }).lean().exec();
  }

  async findOne(id: string): Promise<VehicleDocument> {
    const vehicle = await this.vehicleModel.findById(id).exec();
    if (!vehicle) {
      throw new NotFoundException(`Vehicle #${id} not found`);
    }
    return vehicle;
  }

  async update(id: string, updateVehicleDto: any): Promise<VehicleDocument> {
    const existingVehicle = await this.vehicleModel.findByIdAndUpdate(
      id,
      updateVehicleDto,
      { new: true }
    ).exec();
    if (!existingVehicle) {
      throw new NotFoundException(`Vehicle #${id} not found`);
    }
    return existingVehicle;
  }

  async remove(id: string): Promise<any> {
    const deletedVehicle = await this.vehicleModel.findByIdAndDelete(id).exec();
    if (!deletedVehicle) {
      throw new NotFoundException(`Vehicle #${id} not found`);
    }
    return deletedVehicle;
  }
}

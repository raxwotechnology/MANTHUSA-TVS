import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VehicleDocument } from './schemas/vehicle.schema';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel('Vehicle') private vehicleModel: Model<VehicleDocument>
  ) {}

  private calculateFinancials(dto: any) {
    const purchase = Number(dto.purchasePrice || 0);
    const importCost = Number(dto.importCost || 0);
    const transport = Number(dto.transportCost || 0);
    const repair = Number(dto.repairCost || 0);
    const detailing = Number(dto.detailingCost || 0);
    const registration = Number(dto.registrationCost || 0);
    const insurance = Number(dto.insuranceCost || 0);
    const ad = Number(dto.advertisementCost || 0);
    const other = Number(dto.otherCosts || 0);

    const calculatedInvestment = purchase + importCost + transport + repair + detailing + registration + insurance + ad + other;
    const totalInvestment = dto.totalInvestment && Number(dto.totalInvestment) > 0 ? Number(dto.totalInvestment) : calculatedInvestment;
    const sellingPrice = Number(dto.sellingPrice || 0);
    const expectedProfit = sellingPrice > 0 ? sellingPrice - totalInvestment : Number(dto.expectedProfit || 0);

    return { ...dto, totalInvestment, expectedProfit };
  }

  async create(createVehicleDto: any): Promise<VehicleDocument> {
    const payload = this.calculateFinancials(createVehicleDto);
    const createdVehicle = new this.vehicleModel(payload);
    return createdVehicle.save();
  }

  async findAll(): Promise<VehicleDocument[]> {
    return this.vehicleModel.find().exec();
  }

  findPublicListings() {
    return this.vehicleModel.find({ status: 'Available' }).select('make model variant year manufacturingYear registeredYear vehicleType condition fuelType transmission driveType engineCapacity mileage color sellingPrice images mediaAngles horsepower torque seatingCapacity doors bodyType safetyFeatures entertainmentFeatures comfortFeatures customSpecifications status').sort({ createdAt: -1 }).lean().exec();
  }

  async findOne(id: string): Promise<VehicleDocument> {
    const vehicle = await this.vehicleModel.findById(id).exec();
    if (!vehicle) {
      throw new NotFoundException(`Vehicle #${id} not found`);
    }
    return vehicle;
  }

  async update(id: string, updateVehicleDto: any): Promise<VehicleDocument> {
    const payload = this.calculateFinancials(updateVehicleDto);
    const existingVehicle = await this.vehicleModel.findByIdAndUpdate(
      id,
      payload,
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

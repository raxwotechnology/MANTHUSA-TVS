import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StockMovementDocument } from './schemas/stock-movement.schema';

@Injectable()
export class StockMovementsService {
  constructor(
    @InjectModel('StockMovement') private stockMovementModel: Model<StockMovementDocument>,
  ) {}

  async create(dto: any) {
    const record = new this.stockMovementModel(dto);
    return record.save();
  }

  async findByVehicle(vehicleId: string) {
    return this.stockMovementModel
      .find({ vehicle: vehicleId })
      .populate('fromBranch toBranch updatedBy', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findAll() {
    return this.stockMovementModel
      .find()
      .populate('vehicle fromBranch toBranch updatedBy', 'make model stockNumber registrationNumber name email')
      .sort({ createdAt: -1 })
      .limit(100)
      .exec();
  }
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type VehicleCostDocument = VehicleCost & Document;

@Schema({ timestamps: true })
export class VehicleCost {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Vehicle', required: true })
  vehicle: Types.ObjectId;

  @Prop({ default: 0 })
  purchasePrice: number;

  @Prop({ default: 0 })
  importCost: number;

  @Prop({ default: 0 })
  transportCost: number;

  @Prop({ default: 0 })
  repairCost: number;

  @Prop({ default: 0 })
  detailingCost: number;

  @Prop({ default: 0 })
  registrationCost: number;

  @Prop({ default: 0 })
  insuranceCost: number;

  @Prop({ default: 0 })
  advertisementCost: number;

  @Prop({ default: 0 })
  otherCosts: number;

  @Prop({ default: 0 })
  totalInvestment: number;

  @Prop({ default: 0 })
  sellingPrice: number;

  @Prop({ default: 0 })
  minimumSellingPrice: number;

  @Prop({ default: 0 })
  expectedProfit: number;
}

export const VehicleCostSchema = SchemaFactory.createForClass(VehicleCost);

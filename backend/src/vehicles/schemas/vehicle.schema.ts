import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VehicleDocument = Vehicle & Document;

@Schema({ timestamps: true })
export class Vehicle {
  @Prop({ required: true, unique: true })
  stockNumber: string;

  @Prop()
  registrationNumber: string;

  @Prop({ required: true })
  make: string;

  @Prop({ required: true })
  model: string;

  @Prop()
  variant: string;

  @Prop()
  manufacturingYear: number;

  @Prop()
  registeredYear: number;

  @Prop()
  vehicleType: string;

  @Prop()
  condition: string;

  @Prop()
  fuelType: string;

  @Prop()
  transmission: string;

  @Prop()
  driveType: string;

  @Prop()
  engineCapacity: string;

  @Prop()
  engineNumber: string;

  @Prop()
  chassisNumber: string;

  @Prop()
  mileage: number;

  @Prop()
  color: string;

  @Prop({ default: 'Available' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'Branch' })
  location: Types.ObjectId;

  // Added to match frontend payload
  @Prop()
  year: number;

  @Prop()
  purchasePrice: number;

  @Prop()
  transportCost: number;

  @Prop()
  repairCost: number;

  @Prop()
  detailingCost: number;

  @Prop()
  totalInvestment: number;

  @Prop()
  sellingPrice: number;

  @Prop()
  minimumSellingPrice: number;

  @Prop()
  expectedProfit: number;

  @Prop([String])
  images: string[];
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

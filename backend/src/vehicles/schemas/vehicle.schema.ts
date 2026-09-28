import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

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

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Branch' })
  location: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Branch' })
  branch: Types.ObjectId;

  // Added to match frontend payload
  @Prop()
  year: number;

  // Financial Breakdown
  @Prop()
  purchasePrice: number;

  @Prop()
  importCost: number;

  @Prop()
  transportCost: number;

  @Prop()
  repairCost: number;

  @Prop()
  detailingCost: number;

  @Prop()
  registrationCost: number;

  @Prop()
  insuranceCost: number;

  @Prop()
  advertisementCost: number;

  @Prop()
  otherCosts: number;

  @Prop()
  totalInvestment: number;

  @Prop()
  sellingPrice: number;

  @Prop()
  minimumSellingPrice: number;

  @Prop()
  expectedProfit: number;

  @Prop()
  actualProfit: number;

  // Detailed Specifications
  @Prop()
  horsepower: number;

  @Prop()
  torque: string;

  @Prop()
  seatingCapacity: number;

  @Prop()
  doors: number;

  @Prop()
  bodyType: string;

  @Prop()
  dimensions: string;

  @Prop()
  weight: string;

  @Prop()
  fuelTankCapacity: string;

  @Prop([String])
  safetyFeatures: string[];

  @Prop([String])
  entertainmentFeatures: string[];

  @Prop([String])
  comfortFeatures: string[];

  @Prop({ type: Object })
  customSpecifications: Record<string, string>;

  // Media & Angles
  @Prop([String])
  images: string[];

  @Prop({ type: Object })
  mediaAngles: {
    front?: string;
    rear?: string;
    left?: string;
    right?: string;
    interior?: string;
    dashboard?: string;
    engine?: string;
    wheels?: string;
    damage?: string[];
    documents?: string[];
    view360Url?: string;
    videoUrl?: string;
    youtubeUrl?: string;
  };
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

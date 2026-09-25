const fs = require('fs');
const path = require('path');

const schemas = {
  'vehicles/schemas/vehicle.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
`,
  'vehicles/schemas/vehicle-cost.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VehicleCostDocument = VehicleCost & Document;

@Schema({ timestamps: true })
export class VehicleCost {
  @Prop({ type: Types.ObjectId, ref: 'Vehicle', required: true })
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
`,
  'vehicles/schemas/vehicle-media.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VehicleMediaDocument = VehicleMedia & Document;

@Schema({ timestamps: true })
export class VehicleMedia {
  @Prop({ type: Types.ObjectId, ref: 'Vehicle', required: true })
  vehicle: Types.ObjectId;

  @Prop()
  mediaType: string; // 'IMAGE', 'DOCUMENT', 'VIDEO', 'YOUTUBE'

  @Prop()
  category: string; // 'EXTERIOR', 'INTERIOR', 'ENGINE', 'DAMAGE', 'MAIN'

  @Prop({ required: true })
  url: string;
}

export const VehicleMediaSchema = SchemaFactory.createForClass(VehicleMedia);
`,
  'vehicles/schemas/vehicle-feature.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VehicleFeatureDocument = VehicleFeature & Document;

@Schema({ timestamps: true })
export class VehicleFeature {
  @Prop({ type: Types.ObjectId, ref: 'Vehicle', required: true })
  vehicle: Types.ObjectId;

  @Prop({ required: true })
  category: string; // 'SAFETY', 'COMFORT', 'ENTERTAINMENT', 'SPECIFICATION'

  @Prop({ required: true })
  featureName: string;

  @Prop()
  featureValue: string;
}

export const VehicleFeatureSchema = SchemaFactory.createForClass(VehicleFeature);
`,
  'vehicle-inspections/schemas/vehicle-inspection.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VehicleInspectionDocument = VehicleInspection & Document;

@Schema({ timestamps: true })
export class VehicleInspection {
  @Prop({ type: Types.ObjectId, ref: 'Vehicle', required: true })
  vehicle: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  inspector: Types.ObjectId;

  @Prop({ type: Object })
  checklist: any; // Exterior, Interior, Engine, Documents

  @Prop()
  result: string; // 'Passed', 'Passed with Issues', 'Failed'

  @Prop()
  notes: string;

  @Prop()
  estimatedRepairCost: number;

  @Prop([String])
  images: string[];
}

export const VehicleInspectionSchema = SchemaFactory.createForClass(VehicleInspection);
`,
  'vehicle-purchases/schemas/vehicle-purchase.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VehiclePurchaseDocument = VehiclePurchase & Document;

@Schema({ timestamps: true })
export class VehiclePurchase {
  @Prop({ type: Types.ObjectId, ref: 'Vehicle', required: true })
  vehicle: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Supplier', required: true })
  supplier: Types.ObjectId;

  @Prop({ required: true })
  purchaseDate: Date;

  @Prop({ required: true })
  purchasePrice: number;

  @Prop()
  additionalCosts: number;

  @Prop()
  paymentStatus: string;
}

export const VehiclePurchaseSchema = SchemaFactory.createForClass(VehiclePurchase);
`,
  'suppliers/schemas/supplier.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SupplierDocument = Supplier & Document;

@Schema({ timestamps: true })
export class Supplier {
  @Prop({ required: true })
  name: string;

  @Prop()
  supplierType: string;

  @Prop()
  contactPerson: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  email: string;

  @Prop()
  address: string;

  @Prop({ type: Object })
  bankDetails: any;

  @Prop({ default: 0 })
  outstandingBalance: number;
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);
`,
  'supplier-payments/schemas/supplier-payment.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SupplierPaymentDocument = SupplierPayment & Document;

@Schema({ timestamps: true })
export class SupplierPayment {
  @Prop({ type: Types.ObjectId, ref: 'Supplier', required: true })
  supplier: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'VehiclePurchase' })
  purchase: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  paymentDate: Date;

  @Prop()
  paymentMethod: string;

  @Prop()
  referenceNumber: string;
}

export const SupplierPaymentSchema = SchemaFactory.createForClass(SupplierPayment);
`
};

for (const [relativePath, content] of Object.entries(schemas)) {
  const fullPath = path.join(__dirname, 'src', relativePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content);
}

console.log('Phase 2 Schemas generated');

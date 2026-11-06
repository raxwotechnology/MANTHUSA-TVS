import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type VehicleDocument = Vehicle & Document;

@Schema({ timestamps: true })
export class Vehicle {
  @Prop({ required: true, unique: true })
  stockNumber: string;

  @Prop()
  registrationNumber: string;

  @Prop({ required: true, default: 'TVS' })
  make: string; // Brand: TVS

  @Prop({ required: true })
  model: string; // e.g. Apache RTR 160 4V, NTORQ 125, Jupiter 125

  @Prop()
  variant: string; // Default variant e.g. Disc, Special Edition

  @Prop({ default: 'Sport Motorcycles' })
  category: string; // 'Scooters', 'Commuter Motorcycles', 'Sport Motorcycles', 'Premium Motorcycles', 'Electric Two-Wheelers'

  @Prop()
  manufacturingYear: number;

  @Prop()
  registeredYear: number;

  @Prop({ default: 'Motorcycle' })
  vehicleType: string;

  @Prop({ default: 'Brand New' })
  condition: string; // 'Brand New', 'Pre-Owned'

  @Prop({ default: 'Petrol' })
  fuelType: string; // 'Petrol', 'Electric'

  @Prop({ default: 'Manual' })
  transmission: string; // '5-Speed Manual', '6-Speed Manual', 'CVT Automatic'

  @Prop()
  engineCapacity: string; // e.g. '159.7 cc'

  @Prop()
  engineType: string; // e.g. 'SI, 4 stroke, Oil cooled, SOHC, Fuel Injection'

  @Prop()
  maxPower: string; // e.g. '17.55 PS @ 9250 rpm'

  @Prop()
  maxTorque: string; // e.g. '14.73 Nm @ 7250 rpm'

  @Prop()
  coolingSystem: string; // 'Oil Cooled', 'Air Cooled', 'Liquid Cooled'

  @Prop()
  fuelSystem: string; // 'RT-Fi (Race Tuned Fuel Injection)', 'ET-Fi', 'Carburetor'

  @Prop()
  startingSystem: string; // 'Electric Start', 'Electric & Kick'

  @Prop()
  topSpeed: string; // e.g. '114 km/h'

  @Prop()
  mileage: number; // e.g. 45 km/l

  @Prop()
  fuelTankCapacity: string; // e.g. '12 L'

  @Prop()
  frontBrake: string; // e.g. '270mm Roto Petal Disc'

  @Prop()
  rearBrake: string; // e.g. '200mm Roto Petal Disc'

  @Prop()
  brakingSystem: string; // e.g. 'Single Channel Super-Moto ABS', 'Dual Channel ABS', 'SBT'

  @Prop()
  frontSuspension: string; // e.g. 'Telescopic Forks'

  @Prop()
  rearSuspension: string; // e.g. 'Monoshock', 'Gas Charged Shock'

  @Prop()
  wheelType: string; // 'Alloy', 'Spoke'

  @Prop()
  tyreDimensions: string; // e.g. 'Front: 90/90-17, Rear: 130/70-17'

  @Prop()
  groundClearance: string; // e.g. '180 mm'

  @Prop()
  seatHeight: string; // e.g. '800 mm'

  @Prop()
  kerbWeight: string; // e.g. '144 kg'

  @Prop([String])
  smartFeatures: string[]; // SmartXonnect, Ride Modes, GTT, etc.

  @Prop()
  color: string;

  // TVS Model Variants list
  @Prop({ type: [Object], default: [] })
  variants: Array<{
    name: string;
    code?: string;
    price: number;
    colors?: string[];
    specifications?: Record<string, string>;
    isDefault?: boolean;
  }>;

  // TVS Model Colors with color codes & image URLs
  @Prop({ type: [Object], default: [] })
  colors: Array<{
    name: string;
    code?: string;
    hex?: string;
    imageUrl?: string;
    available?: boolean;
  }>;

  // Branch Stock allocation
  @Prop({ type: [Object], default: [] })
  branchStock: Array<{
    branchId?: Types.ObjectId;
    branchName: string;
    quantity: number;
    availableColors?: string[];
  }>;

  @Prop({ default: 'In Stock' })
  status: string; // 'In Stock', 'Reserved', 'Booking Pending', 'Sold', 'Delivered', 'Under Inspection', 'Available'

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Branch' })
  location: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Branch' })
  branch: Types.ObjectId;

  @Prop()
  engineNumber: string;

  @Prop()
  chassisNumber: string;

  @Prop()
  roundNumber: string;

  @Prop()
  year: number;

  @Prop({ default: true })
  isPublished: boolean;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop()
  shortDescription: string;

  @Prop()
  description: string;

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

  @Prop({ required: true, default: 0 })
  sellingPrice: number;

  @Prop()
  minimumSellingPrice: number;

  @Prop()
  expectedProfit: number;

  @Prop()
  actualProfit: number;

  // Specifications fallback
  @Prop([String])
  safetyFeatures: string[];

  @Prop([String])
  entertainmentFeatures: string[];

  @Prop([String])
  comfortFeatures: string[];

  @Prop({ type: Object })
  customSpecifications: Record<string, string>;

  // Media
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

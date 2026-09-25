import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VehicleValuationDocument = VehicleValuation & Document;

@Schema({ timestamps: true })
export class VehicleValuation {
  @Prop({ required: true })
  valuationId: string;

  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  customerPhone: string;

  @Prop()
  customerEmail: string;

  @Prop({ required: true })
  vehicleMake: string;

  @Prop({ required: true })
  vehicleModel: string;

  @Prop({ required: true })
  year: number;

  @Prop()
  mileage: number;

  @Prop()
  condition: string;

  @Prop()
  askingPrice: number;

  @Prop({ default: 0 })
  marketValuation: number;

  @Prop({ default: 0 })
  repairEstimate: number;

  @Prop({ default: 0 })
  offeredPurchasePrice: number;

  @Prop({ default: 'Pending', enum: ['Pending', 'Inspection Scheduled', 'Inspected', 'Offer Made', 'Accepted', 'Rejected'] })
  status: string;

  @Prop({ type: [String] })
  images: string[];

  @Prop()
  notes: string;
}

export const VehicleValuationSchema = SchemaFactory.createForClass(VehicleValuation);

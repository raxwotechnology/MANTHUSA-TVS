import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LeadDocument = Lead & Document;

@Schema({ timestamps: true })
export class Lead {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Vehicle' })
  interestedVehicle: Types.ObjectId;

  @Prop()
  source: string; // Facebook, Walk-in, Referral, etc.

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedStaff: Types.ObjectId;

  @Prop()
  budget: number;

  @Prop()
  expectedPurchaseDate: Date;

  @Prop({ default: 'New' })
  status: string; // New, Contacted, Interested, Test Drive, Quotation, Reserved, Won/Lost

  @Prop({ default: 'Medium' })
  priority: string; // High, Medium, Low
}

export const LeadSchema = SchemaFactory.createForClass(Lead);

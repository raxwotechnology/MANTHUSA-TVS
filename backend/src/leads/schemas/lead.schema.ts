import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type LeadDocument = Lead & Document;

@Schema({ timestamps: true })
export class Lead {
  @Prop({ unique: true, sparse: true })
  leadId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Vehicle' })
  interestedVehicle: Types.ObjectId;

  @Prop()
  interestedVehicleText: string;

  @Prop()
  modelName: string;

  @Prop()
  variantName: string;

  @Prop()
  selectedColor: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Branch' })
  preferredBranch: Types.ObjectId;

  @Prop()
  preferredBranchName: string;

  @Prop({ default: 'Website Configurator' })
  source: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  assignedStaff: Types.ObjectId;

  @Prop()
  budget: number;

  @Prop()
  expectedPurchaseDate: Date;

  @Prop({ default: 'Motorcycle Booking Request' })
  inquiryType: string;

  @Prop()
  inquiryMessage: string;

  @Prop()
  preferredDate: Date;

  @Prop({ default: 'New Request' })
  status: string; // 'New Request', 'Under Review', 'Availability Checked', 'Converted to Booking', 'Closed'

  @Prop({ default: 'Medium' })
  priority: string; // High, Medium, Low

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Reservation' })
  bookingId: Types.ObjectId;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);

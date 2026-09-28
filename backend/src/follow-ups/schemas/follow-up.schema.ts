import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type FollowUpDocument = FollowUp & Document;

@Schema({ timestamps: true })
export class FollowUp {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Vehicle' })
  vehicle: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Lead' })
  lead: Types.ObjectId;

  @Prop({ required: true })
  followUpDate: Date;

  @Prop()
  followUpTime: string;

  @Prop({ required: true })
  type: string; // 'Phone', 'WhatsApp', 'Email', 'Meeting', 'Test Drive'

  @Prop()
  notes: string;

  @Prop({ default: 'Scheduled' })
  status: string; // 'Scheduled', 'Completed', 'Cancelled'

  @Prop()
  nextFollowUp: Date;
}

export const FollowUpSchema = SchemaFactory.createForClass(FollowUp);

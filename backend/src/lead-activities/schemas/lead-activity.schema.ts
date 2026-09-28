import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type LeadActivityDocument = LeadActivity & Document;

@Schema({ timestamps: true })
export class LeadActivity {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Lead', required: true })
  lead: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  performedBy: Types.ObjectId;

  @Prop({ required: true })
  activityType: string; // 'STATUS_CHANGE', 'NOTE_ADDED', 'FOLLOW_UP_CREATED', 'TEST_DRIVE_SCHEDULED'

  @Prop()
  oldStatus: string;

  @Prop()
  newStatus: string;

  @Prop()
  description: string;
}

export const LeadActivitySchema = SchemaFactory.createForClass(LeadActivity);

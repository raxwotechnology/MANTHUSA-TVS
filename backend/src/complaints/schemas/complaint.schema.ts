import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type ComplaintDocument = Complaint & Document;

@Schema({ timestamps: true })
export class Complaint {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Vehicle' })
  vehicle: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Sale' })
  sale: Types.ObjectId;

  @Prop({ required: true })
  priority: string; // 'Low', 'Medium', 'High', 'Critical'

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  assignedStaff: Types.ObjectId;

  @Prop({ required: true })
  description: string;

  @Prop()
  resolution: string;

  @Prop({ default: 'Open' })
  status: string; // 'Open', 'In Progress', 'Resolved', 'Closed'
}

export const ComplaintSchema = SchemaFactory.createForClass(Complaint);

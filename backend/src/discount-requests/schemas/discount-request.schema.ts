import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type DiscountRequestDocument = DiscountRequest & Document;

@Schema({ timestamps: true })
export class DiscountRequest {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Quotation' })
  quotation: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Sale' })
  sale: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  requestedBy: Types.ObjectId;

  @Prop({ required: true })
  requestedDiscount: number;

  @Prop()
  reason: string;

  @Prop({ default: 'Pending' })
  status: string; // 'Pending', 'Approved', 'Rejected'

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  approvedBy: Types.ObjectId;

  @Prop()
  approvalDate: Date;
}

export const DiscountRequestSchema = SchemaFactory.createForClass(DiscountRequest);

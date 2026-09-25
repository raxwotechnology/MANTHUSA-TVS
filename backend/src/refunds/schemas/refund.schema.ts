import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RefundDocument = Refund & Document;

@Schema({ timestamps: true })
export class Refund {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Sale' })
  sale: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Reservation' })
  reservation: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  refundDate: Date;

  @Prop()
  reason: string;

  @Prop()
  paymentMethod: string;

  @Prop({ default: 'Completed' })
  status: string; // 'Pending', 'Completed'
}

export const RefundSchema = SchemaFactory.createForClass(Refund);

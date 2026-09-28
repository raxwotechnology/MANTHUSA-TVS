import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Sale', required: true })
  sale: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  paymentDate: Date;

  @Prop({ required: true })
  paymentMethod: string; // Cash, Bank Transfer, Card, Cheque, Online, Finance

  @Prop()
  referenceNumber: string;

  @Prop()
  bank: string;

  @Prop({ unique: true, sparse: true })
  receiptNumber: string;

  @Prop()
  notes: string;

  @Prop()
  chequeNumber: string;

  @Prop()
  chequeDate: Date;

  @Prop()
  chequeStatus: string; // 'Pending Cheque', 'Cleared', 'Bounced'

  @Prop({ default: 'Completed' })
  status: string; // 'Completed', 'Reversed', 'Refunded'
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

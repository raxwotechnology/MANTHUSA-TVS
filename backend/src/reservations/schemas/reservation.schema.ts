import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type ReservationDocument = Reservation & Document;

@Schema({ timestamps: true })
export class Reservation {
  @Prop({ unique: true, sparse: true })
  reservationId: string;

  @Prop()
  bookingNumber: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Vehicle', required: true })
  vehicle: Types.ObjectId;

  @Prop()
  modelName: string;

  @Prop()
  variantName: string;

  @Prop()
  selectedColor: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Branch' })
  branch: Types.ObjectId;

  @Prop()
  branchName: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  salesperson: Types.ObjectId;

  @Prop({ default: 0 })
  reservationDeposit: number;

  @Prop({ default: 0 })
  agreedPrice: number;

  @Prop({ required: true })
  expiryDate: Date;

  @Prop({ default: true })
  isRefundable: boolean;

  @Prop({ default: 'Active' })
  status: string; // 'Active', 'Confirmed', 'Quoted', 'Invoiced', 'Expired', 'Cancelled'

  @Prop()
  chassisNumber: string;

  @Prop()
  engineNumber: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Lead' })
  leadId: Types.ObjectId;

  @Prop()
  cancellationReason: string;

  @Prop({ default: 'Not Applicable' })
  refundStatus: string;

  @Prop({ default: 'Cash' })
  paymentMethod: string;

  @Prop()
  notes: string;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);

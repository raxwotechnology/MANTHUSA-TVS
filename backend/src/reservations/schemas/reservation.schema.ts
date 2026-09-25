import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReservationDocument = Reservation & Document;

@Schema({ timestamps: true })
export class Reservation {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Vehicle', required: true })
  vehicle: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  salesperson: Types.ObjectId;

  @Prop({ required: true })
  reservationDeposit: number;

  @Prop({ required: true })
  expiryDate: Date;

  @Prop({ default: false })
  isRefundable: boolean;

  @Prop({ default: 'Active' })
  status: string; // 'Active', 'Expired', 'ConvertedToSale', 'Cancelled'

  @Prop()
  cancellationReason: string;

  @Prop()
  refundStatus: string; // 'Pending', 'Refunded', 'Not Applicable'
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);

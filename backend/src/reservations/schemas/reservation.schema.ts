import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type ReservationDocument = Reservation & Document;

@Schema({ timestamps: true })
export class Reservation {
  @Prop({ unique: true, sparse: true })
  reservationId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Vehicle', required: true })
  vehicle: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
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

  @Prop()
  paymentMethod: string;

  @Prop()
  notes: string;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);

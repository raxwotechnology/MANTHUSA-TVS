import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type QuotationDocument = Quotation & Document;

@Schema({ timestamps: true })
export class Quotation {
  @Prop({ required: true, unique: true })
  quotationNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Vehicle', required: true })
  vehicle: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  salesperson: Types.ObjectId;

  @Prop({ default: 0 })
  vehiclePrice: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ default: 0 })
  registrationFee: number;

  @Prop({ default: 0 })
  insuranceFee: number;

  @Prop({ default: 0 })
  otherCharges: number;

  @Prop({ default: 0 })
  totalAmount: number;

  @Prop()
  validUntil: Date;
}

export const QuotationSchema = SchemaFactory.createForClass(Quotation);

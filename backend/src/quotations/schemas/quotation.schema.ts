import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type QuotationDocument = Quotation & Document;

@Schema({ timestamps: true })
export class Quotation {
  @Prop({ required: true, unique: true })
  quotationNumber: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Vehicle', required: true })
  vehicle: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Reservation' })
  booking: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  salesperson: Types.ObjectId;

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

  @Prop({ default: 0 })
  advancePayment: number;

  @Prop()
  validUntil: Date;

  @Prop({ default: 'Sent' })
  status: string; // 'Draft', 'Pending Approval', 'Sent', 'Accepted', 'Rejected', 'Converted to Invoice'

  @Prop()
  acceptedAt: Date;

  @Prop()
  rejectedAt: Date;

  @Prop()
  rejectionReason: string;

  @Prop()
  notes: string;

  @Prop({
    default:
      '1. Quotation valid for 14 days from the date of issue.\n2. Official TVS manufacturer warranty of 5 years or 70,000 km applies.\n3. Free 3 periodic services included.\n4. Prices subject to government statutory fee changes.',
  })
  termsAndConditions: string;
}

export const QuotationSchema = SchemaFactory.createForClass(Quotation);

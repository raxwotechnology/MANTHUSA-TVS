import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type SaleDocument = Sale & Document;

@Schema({ timestamps: true })
export class Sale {
  @Prop({ required: true, unique: true })
  invoiceNumber: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Vehicle', required: true })
  vehicle: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Quotation' })
  quotation: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Reservation' })
  booking: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  salesperson: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Branch' })
  branch: Types.ObjectId;

  @Prop()
  branchName: string;

  @Prop()
  modelName: string;

  @Prop()
  variantName: string;

  @Prop()
  selectedColor: string;

  @Prop()
  chassisNumber: string;

  @Prop()
  engineNumber: string;

  @Prop({ default: 0 })
  vehiclePrice: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ default: 0 })
  registrationFee: number;

  @Prop({ default: 0 })
  insuranceFee: number;

  @Prop({ default: 0 })
  additionalCharges: number;

  @Prop({ default: 0 })
  finalAmount: number;

  @Prop({ default: 0 })
  paidAmount: number;

  @Prop({ default: 0 })
  balance: number;

  @Prop({ default: 'Cash' })
  paymentMethod: string; // 'Cash', 'Bank Transfer', 'Card', 'Leasing'

  @Prop()
  leasingProvider: string;

  @Prop({ default: 0 })
  leasingAmount: number;

  @Prop()
  salesContractNumber: string;

  @Prop({ default: 'Pending' })
  status: string; // 'Pending', 'Partially Paid', 'Paid in Full', 'Ready for Delivery', 'Delivered', 'Cancelled'

  @Prop({ default: 'Pending' })
  deliveryStatus: string; // 'Pending', 'PDI Completed', 'Scheduled', 'Delivered'

  @Prop()
  deliveredAt: Date;

  @Prop()
  saleDate: Date;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);

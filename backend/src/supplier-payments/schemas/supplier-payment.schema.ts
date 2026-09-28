import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type SupplierPaymentDocument = SupplierPayment & Document;

@Schema({ timestamps: true })
export class SupplierPayment {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Supplier', required: true })
  supplier: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'VehiclePurchase' })
  purchase: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  paymentDate: Date;

  @Prop()
  paymentMethod: string;

  @Prop()
  referenceNumber: string;
}

export const SupplierPaymentSchema = SchemaFactory.createForClass(SupplierPayment);

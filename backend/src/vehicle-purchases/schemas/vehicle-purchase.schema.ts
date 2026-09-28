import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type VehiclePurchaseDocument = VehiclePurchase & Document;

@Schema({ timestamps: true })
export class VehiclePurchase {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Vehicle', required: true })
  vehicle: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Supplier', required: true })
  supplier: Types.ObjectId;

  @Prop({ required: true })
  purchaseDate: Date;

  @Prop({ required: true })
  purchasePrice: number;

  @Prop()
  additionalCosts: number;

  @Prop()
  paymentStatus: string;

  @Prop({ default: 0 })
  paidAmount: number;

  @Prop()
  sellerNicPassport: string;

  @Prop()
  sellerPhone: string;

  @Prop()
  sellerAddress: string;

  @Prop()
  sellerBankDetails: string;
}

export const VehiclePurchaseSchema = SchemaFactory.createForClass(VehiclePurchase);

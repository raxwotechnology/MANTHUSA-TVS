import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VehiclePurchaseDocument = VehiclePurchase & Document;

@Schema({ timestamps: true })
export class VehiclePurchase {
  @Prop({ type: Types.ObjectId, ref: 'Vehicle', required: true })
  vehicle: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Supplier', required: true })
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
}

export const VehiclePurchaseSchema = SchemaFactory.createForClass(VehiclePurchase);

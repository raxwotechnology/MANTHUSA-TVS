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

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  salesperson: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Branch' })
  branch: Types.ObjectId;

  @Prop({ default: 0 })
  vehiclePrice: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ default: 0 })
  tradeInAllowance: number;

  @Prop({ type: Object })
  tradeInVehicleDetails: {
    make?: string;
    model?: string;
    year?: number;
    regNumber?: string;
    valuationAmount?: number;
  };

  @Prop()
  leasingProvider: string;

  @Prop({ default: 0 })
  leasingAmount: number;

  @Prop()
  paymentMethod: string; // 'Cash', 'Bank Transfer', 'Cheque', 'Card', 'Leasing'

  @Prop()
  salesContractNumber: string;

  @Prop({ default: 0 })
  additionalCharges: number;

  @Prop({ default: 0 })
  finalAmount: number;

  @Prop({ default: 0 })
  paidAmount: number;

  @Prop({ default: 0 })
  balance: number;

  @Prop({ default: 'Pending' })
  status: string; // 'Pending', 'Confirmed', 'Completed', 'Cancelled', 'Refunded'

  @Prop()
  saleDate: Date;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);

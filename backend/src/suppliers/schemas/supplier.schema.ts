import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SupplierDocument = Supplier & Document;

@Schema({ timestamps: true })
export class Supplier {
  @Prop({ unique: true, sparse: true })
  supplierId: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  supplierType: string;

  @Prop()
  contactPerson: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  email: string;

  @Prop()
  address: string;

  @Prop({ type: Object })
  bankDetails: any;

  @Prop({ default: 0 })
  outstandingBalance: number;
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);

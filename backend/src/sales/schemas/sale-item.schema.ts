import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type SaleItemDocument = SaleItem & Document;

@Schema({ timestamps: true })
export class SaleItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Sale', required: true })
  sale: Types.ObjectId;

  @Prop({ required: true })
  description: string;

  @Prop({ default: 0 })
  amount: number;

  @Prop()
  type: string; // 'ADDITION', 'DEDUCTION'
}

export const SaleItemSchema = SchemaFactory.createForClass(SaleItem);

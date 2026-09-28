import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type QuotationItemDocument = QuotationItem & Document;

@Schema({ timestamps: true })
export class QuotationItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Quotation', required: true })
  quotation: Types.ObjectId;

  @Prop({ required: true })
  description: string;

  @Prop({ default: 0 })
  amount: number;

  @Prop()
  type: string; // e.g., 'ADDITION', 'DEDUCTION'
}

export const QuotationItemSchema = SchemaFactory.createForClass(QuotationItem);

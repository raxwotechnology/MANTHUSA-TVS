import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExpenseCategoryDocument = ExpenseCategory & Document;

@Schema({ timestamps: true })
export class ExpenseCategory {
  @Prop({ required: true, unique: true })
  name: string; // Vehicle Repair, Transport, Fuel, Advertising, etc.

  @Prop()
  description: string;
}

export const ExpenseCategorySchema = SchemaFactory.createForClass(ExpenseCategory);

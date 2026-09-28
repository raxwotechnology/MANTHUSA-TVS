import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ExpenseDocument = Expense & Document;

@Schema({ timestamps: true })
export class Expense {
  @Prop({ unique: true, sparse: true })
  expenseId: string;

  @Prop({ type: Types.ObjectId, ref: 'ExpenseCategory', required: true })
  category: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  expenseDate: Date;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Vehicle' })
  vehicle: Types.ObjectId; // If linked to a specific vehicle

  @Prop({ type: Types.ObjectId, ref: 'Supplier' })
  supplier: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Branch' })
  branch: Types.ObjectId;

  @Prop()
  paymentMethod: string;

  @Prop()
  receiptUrl: string;

  @Prop()
  receiptNumber: string;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CashTransactionDocument = CashTransaction & Document;

@Schema({ timestamps: true })
export class CashTransaction {
  @Prop({ required: true })
  transactionType: string; // 'IN' or 'OUT'

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  transactionDate: Date;

  @Prop({ required: true })
  source: string; // 'CustomerPayment', 'OtherIncome', 'SupplierPayment', 'Expense', 'Refund', 'OpeningBalance'

  @Prop({ type: Types.ObjectId })
  referenceId: Types.ObjectId; // ID of the Payment, Expense, etc.

  @Prop()
  description: string;

  @Prop()
  paymentMethod: string;

  @Prop()
  referenceNumber: string;
}

export const CashTransactionSchema = SchemaFactory.createForClass(CashTransaction);

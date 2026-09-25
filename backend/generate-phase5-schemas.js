const fs = require('fs');
const path = require('path');

const schemas = {
  'payments/schemas/payment.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'Sale', required: true })
  sale: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  paymentDate: Date;

  @Prop({ required: true })
  paymentMethod: string; // Cash, Bank Transfer, Card, Cheque, Online, Finance

  @Prop()
  referenceNumber: string;

  @Prop()
  bank: string;

  @Prop({ unique: true, sparse: true })
  receiptNumber: string;

  @Prop()
  notes: string;

  @Prop({ default: 'Completed' })
  status: string; // 'Completed', 'Reversed', 'Refunded'
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
`,
  'installments/schemas/installment-agreement.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InstallmentAgreementDocument = InstallmentAgreement & Document;

@Schema({ timestamps: true })
export class InstallmentAgreement {
  @Prop({ type: Types.ObjectId, ref: 'Sale', required: true })
  sale: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({ required: true })
  financeCompany: string;

  @Prop({ required: true })
  loanAmount: number;

  @Prop({ required: true })
  downPayment: number;

  @Prop()
  interestRate: number;

  @Prop({ required: true })
  loanPeriodMonths: number;

  @Prop({ required: true })
  monthlyInstallment: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;
}

export const InstallmentAgreementSchema = SchemaFactory.createForClass(InstallmentAgreement);
`,
  'installments/schemas/installment.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InstallmentDocument = Installment & Document;

@Schema({ timestamps: true })
export class Installment {
  @Prop({ type: Types.ObjectId, ref: 'InstallmentAgreement', required: true })
  agreement: Types.ObjectId;

  @Prop({ required: true })
  installmentNumber: number;

  @Prop({ required: true })
  dueDate: Date;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'Pending' })
  status: string; // 'Pending', 'Paid', 'Overdue'

  @Prop()
  paidDate: Date;
}

export const InstallmentSchema = SchemaFactory.createForClass(Installment);
`,
  'refunds/schemas/refund.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RefundDocument = Refund & Document;

@Schema({ timestamps: true })
export class Refund {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Sale' })
  sale: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Reservation' })
  reservation: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  refundDate: Date;

  @Prop()
  reason: string;

  @Prop()
  paymentMethod: string;

  @Prop({ default: 'Completed' })
  status: string; // 'Pending', 'Completed'
}

export const RefundSchema = SchemaFactory.createForClass(Refund);
`,
  'expense-categories/schemas/expense-category.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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
`,
  'expenses/schemas/expense.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ExpenseDocument = Expense & Document;

@Schema({ timestamps: true })
export class Expense {
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

  @Prop()
  paymentMethod: string;

  @Prop()
  receiptUrl: string;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
`,
  'cash-transactions/schemas/cash-transaction.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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
}

export const CashTransactionSchema = SchemaFactory.createForClass(CashTransaction);
`
};

for (const [relativePath, content] of Object.entries(schemas)) {
  const fullPath = path.join(__dirname, 'src', relativePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content);
}

console.log('Phase 5 Schemas generated');

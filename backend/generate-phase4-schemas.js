const fs = require('fs');
const path = require('path');

const schemas = {
  'quotations/schemas/quotation.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type QuotationDocument = Quotation & Document;

@Schema({ timestamps: true })
export class Quotation {
  @Prop({ required: true, unique: true })
  quotationNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Vehicle', required: true })
  vehicle: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  salesperson: Types.ObjectId;

  @Prop({ default: 0 })
  vehiclePrice: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ default: 0 })
  registrationFee: number;

  @Prop({ default: 0 })
  insuranceFee: number;

  @Prop({ default: 0 })
  otherCharges: number;

  @Prop({ default: 0 })
  totalAmount: number;

  @Prop()
  validUntil: Date;
}

export const QuotationSchema = SchemaFactory.createForClass(Quotation);
`,
  'quotations/schemas/quotation-item.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type QuotationItemDocument = QuotationItem & Document;

@Schema({ timestamps: true })
export class QuotationItem {
  @Prop({ type: Types.ObjectId, ref: 'Quotation', required: true })
  quotation: Types.ObjectId;

  @Prop({ required: true })
  description: string;

  @Prop({ default: 0 })
  amount: number;

  @Prop()
  type: string; // e.g., 'ADDITION', 'DEDUCTION'
}

export const QuotationItemSchema = SchemaFactory.createForClass(QuotationItem);
`,
  'discount-requests/schemas/discount-request.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DiscountRequestDocument = DiscountRequest & Document;

@Schema({ timestamps: true })
export class DiscountRequest {
  @Prop({ type: Types.ObjectId, ref: 'Quotation' })
  quotation: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Sale' })
  sale: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  requestedBy: Types.ObjectId;

  @Prop({ required: true })
  requestedDiscount: number;

  @Prop()
  reason: string;

  @Prop({ default: 'Pending' })
  status: string; // 'Pending', 'Approved', 'Rejected'

  @Prop({ type: Types.ObjectId, ref: 'User' })
  approvedBy: Types.ObjectId;

  @Prop()
  approvalDate: Date;
}

export const DiscountRequestSchema = SchemaFactory.createForClass(DiscountRequest);
`,
  'reservations/schemas/reservation.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReservationDocument = Reservation & Document;

@Schema({ timestamps: true })
export class Reservation {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Vehicle', required: true })
  vehicle: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  salesperson: Types.ObjectId;

  @Prop({ required: true })
  reservationDeposit: number;

  @Prop({ required: true })
  expiryDate: Date;

  @Prop({ default: false })
  isRefundable: boolean;

  @Prop({ default: 'Active' })
  status: string; // 'Active', 'Expired', 'ConvertedToSale', 'Cancelled'

  @Prop()
  cancellationReason: string;

  @Prop()
  refundStatus: string; // 'Pending', 'Refunded', 'Not Applicable'
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
`,
  'sales/schemas/sale.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SaleDocument = Sale & Document;

@Schema({ timestamps: true })
export class Sale {
  @Prop({ required: true, unique: true })
  invoiceNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Vehicle', required: true })
  vehicle: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  salesperson: Types.ObjectId;

  @Prop({ default: 0 })
  vehiclePrice: number;

  @Prop({ default: 0 })
  discount: number;

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
`,
  'sales/schemas/sale-item.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SaleItemDocument = SaleItem & Document;

@Schema({ timestamps: true })
export class SaleItem {
  @Prop({ type: Types.ObjectId, ref: 'Sale', required: true })
  sale: Types.ObjectId;

  @Prop({ required: true })
  description: string;

  @Prop({ default: 0 })
  amount: number;

  @Prop()
  type: string; // 'ADDITION', 'DEDUCTION'
}

export const SaleItemSchema = SchemaFactory.createForClass(SaleItem);
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

console.log('Phase 4 Schemas generated');

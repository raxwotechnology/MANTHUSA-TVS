import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LeasingPartnerDocument = LeasingPartner & Document;

@Schema({ timestamps: true })
export class LeasingPartner {
  @Prop({ required: true })
  name: string; // e.g. "LOLC Finance", "Central Finance", "Commercial Bank Leasing", "LB Finance"

  @Prop()
  contactPerson: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop()
  address: string;

  @Prop()
  defaultInterestRate: number;

  @Prop()
  maxLoanTenureMonths: number;

  @Prop()
  notes: string;
}

export const LeasingPartnerSchema = SchemaFactory.createForClass(LeasingPartner);

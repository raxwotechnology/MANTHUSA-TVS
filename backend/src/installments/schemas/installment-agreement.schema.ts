import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type InstallmentAgreementDocument = InstallmentAgreement & Document;

@Schema({ timestamps: true })
export class InstallmentAgreement {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Sale', required: true })
  sale: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer', required: true })
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

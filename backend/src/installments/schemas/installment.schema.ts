import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type InstallmentDocument = Installment & Document;

@Schema({ timestamps: true })
export class Installment {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'InstallmentAgreement', required: true })
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

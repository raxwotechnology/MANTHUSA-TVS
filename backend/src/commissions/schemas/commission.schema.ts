import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type CommissionDocument = Commission & Document;

@Schema({ timestamps: true })
export class Commission {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  salesperson: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Sale', required: true })
  sale: Types.ObjectId;

  @Prop({ required: true })
  commissionType: string; // 'Fixed Amount', 'Percentage', 'Target Based'

  @Prop()
  commissionPercentage: number;

  @Prop({ required: true })
  commissionAmount: number;

  @Prop({ default: 'Pending' })
  status: string; // 'Pending', 'Approved', 'Paid'

  @Prop()
  paidDate: Date;
}

export const CommissionSchema = SchemaFactory.createForClass(Commission);

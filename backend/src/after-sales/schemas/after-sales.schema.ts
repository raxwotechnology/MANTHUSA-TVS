import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type AfterSalesDocument = AfterSales & Document;

@Schema({ timestamps: true })
export class AfterSales {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Sale', required: true })
  sale: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop()
  customerFeedback: string;

  @Prop({ type: Object })
  reminders: {
    serviceReminder: Date;
    warrantyReminder: Date;
    insuranceRenewalReminder: Date;
    revenueLicenseReminder: Date;
  };

  @Prop()
  nextFollowUp: Date;
}

export const AfterSalesSchema = SchemaFactory.createForClass(AfterSales);

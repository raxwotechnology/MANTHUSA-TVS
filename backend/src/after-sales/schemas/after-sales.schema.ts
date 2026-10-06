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

  @Prop({ type: Object })
  warrantyInfo: {
    engineWarrantyMonths?: number;
    engineWarrantyMileageLimit?: number;
    engineWarrantyExpiryDate?: Date;
    gearboxWarrantyMonths?: number;
    gearboxWarrantyMileageLimit?: number;
    gearboxWarrantyExpiryDate?: Date;
    warrantyStatus?: string;
  };

  @Prop([{
    serviceNumber: Number,
    milestoneKm: Number,
    dueDate: Date,
    status: { type: String, default: 'Scheduled' },
    completedDate: Date,
    notes: String
  }])
  freeServices: Array<{
    serviceNumber: number;
    milestoneKm: number;
    dueDate?: Date;
    status: string;
    completedDate?: Date;
    notes?: string;
  }>;

  @Prop({ type: Object })
  rmvTransfer: {
    transferorName?: string;
    transferorNic?: string;
    transferorAddress?: string;
    transfereeName?: string;
    transfereeNic?: string;
    transfereeAddress?: string;
    vehicleRegNo?: string;
    chassisNo?: string;
    engineNo?: string;
    mta6Status?: string;
    mta8Status?: string;
    rmvRefNumber?: string;
    submittedDate?: Date;
    completedDate?: Date;
    notes?: string;
  };

  @Prop()
  nextFollowUp: Date;
}

export const AfterSalesSchema = SchemaFactory.createForClass(AfterSales);

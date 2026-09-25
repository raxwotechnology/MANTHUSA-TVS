import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TestDriveDocument = TestDrive & Document;

@Schema({ timestamps: true })
export class TestDrive {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Vehicle', required: true })
  vehicle: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  salesperson: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop()
  startTime: string;

  @Prop()
  endTime: string;

  @Prop()
  drivingLicenseNo: string;

  @Prop({ default: 'Scheduled' })
  status: string; // 'Scheduled', 'Completed', 'Cancelled', 'No Show'

  @Prop()
  feedback: string;
}

export const TestDriveSchema = SchemaFactory.createForClass(TestDrive);

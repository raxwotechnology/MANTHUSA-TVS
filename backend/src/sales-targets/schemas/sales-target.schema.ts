import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SalesTargetDocument = SalesTarget & Document;

@Schema({ timestamps: true })
export class SalesTarget {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  salesperson: Types.ObjectId;

  @Prop({ required: true })
  month: string; // e.g. 'YYYY-MM'

  @Prop({ required: true })
  vehicleTarget: number;

  @Prop({ required: true })
  revenueTarget: number;

  @Prop({ default: 0 })
  actualVehicles: number;

  @Prop({ default: 0 })
  actualRevenue: number;

  @Prop({ default: 0 })
  achievementPercentage: number;
}

export const SalesTargetSchema = SchemaFactory.createForClass(SalesTarget);

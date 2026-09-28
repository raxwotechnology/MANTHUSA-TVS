import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type VehicleTransferDocument = VehicleTransfer & Document;

@Schema({ timestamps: true })
export class VehicleTransfer {
  @Prop({ required: true })
  transferId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Vehicle', required: true })
  vehicle: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Branch', required: true })
  fromBranch: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Branch', required: true })
  toBranch: Types.ObjectId;

  @Prop({ default: Date.now })
  transferDate: Date;

  @Prop()
  driverName: string;

  @Prop({ default: 0 })
  transportCost: number;

  @Prop()
  reason: string;

  @Prop({ default: 'Pending', enum: ['Pending', 'In Transit', 'Completed', 'Cancelled'] })
  status: string;
}

export const VehicleTransferSchema = SchemaFactory.createForClass(VehicleTransfer);

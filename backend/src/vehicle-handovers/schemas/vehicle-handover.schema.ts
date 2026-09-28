import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type VehicleHandoverDocument = VehicleHandover & Document;

@Schema({ timestamps: true })
export class VehicleHandover {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Sale', required: true })
  sale: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Vehicle', required: true })
  vehicle: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({ type: Object })
  checklist: {
    vehicleInspection: boolean;
    keys: boolean;
    spareKey: boolean;
    cr: boolean;
    insurance: boolean;
    serviceBook: boolean;
    userManual: boolean;
    accessories: boolean;
    numberPlates: boolean;
    customerSignature: boolean;
  };

  @Prop({ default: 'Pending' })
  status: string; // 'Pending', 'Ready', 'Completed'

  @Prop()
  handoverDate: Date;
}

export const VehicleHandoverSchema = SchemaFactory.createForClass(VehicleHandover);

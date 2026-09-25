import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VehicleInspectionDocument = VehicleInspection & Document;

@Schema({ timestamps: true })
export class VehicleInspection {
  @Prop({ type: Types.ObjectId, ref: 'Vehicle', required: true })
  vehicle: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  inspector: Types.ObjectId;

  @Prop({ type: Object })
  checklist: any; // Exterior, Interior, Engine, Documents

  @Prop()
  result: string; // 'Passed', 'Passed with Issues', 'Failed'

  @Prop()
  notes: string;

  @Prop()
  estimatedRepairCost: number;

  @Prop([String])
  images: string[];
}

export const VehicleInspectionSchema = SchemaFactory.createForClass(VehicleInspection);

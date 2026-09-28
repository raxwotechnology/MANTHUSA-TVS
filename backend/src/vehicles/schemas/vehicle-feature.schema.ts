import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type VehicleFeatureDocument = VehicleFeature & Document;

@Schema({ timestamps: true })
export class VehicleFeature {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Vehicle', required: true })
  vehicle: Types.ObjectId;

  @Prop({ required: true })
  category: string; // 'SAFETY', 'COMFORT', 'ENTERTAINMENT', 'SPECIFICATION'

  @Prop({ required: true })
  featureName: string;

  @Prop()
  featureValue: string;
}

export const VehicleFeatureSchema = SchemaFactory.createForClass(VehicleFeature);

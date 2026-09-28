import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type VehicleMediaDocument = VehicleMedia & Document;

@Schema({ timestamps: true })
export class VehicleMedia {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Vehicle', required: true })
  vehicle: Types.ObjectId;

  @Prop()
  mediaType: string; // 'IMAGE', 'DOCUMENT', 'VIDEO', 'YOUTUBE'

  @Prop()
  category: string; // 'EXTERIOR', 'INTERIOR', 'ENGINE', 'DAMAGE', 'MAIN'

  @Prop({ required: true })
  url: string;
}

export const VehicleMediaSchema = SchemaFactory.createForClass(VehicleMedia);

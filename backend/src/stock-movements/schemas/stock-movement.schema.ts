import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type StockMovementDocument = StockMovement & Document;

@Schema({ timestamps: true })
export class StockMovement {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Vehicle', required: true })
  vehicle: Types.ObjectId;

  @Prop({ required: true })
  action: string; // 'ADDED', 'TRANSFERRED', 'RESERVED', 'SOLD', 'RETURNED', 'REMOVED', 'INSPECTED', 'REPAIRED'

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Branch' })
  fromBranch: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Branch' })
  toBranch: Types.ObjectId;

  @Prop()
  previousStatus: string;

  @Prop()
  newStatus: string;

  @Prop()
  notes: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;
}

export const StockMovementSchema = SchemaFactory.createForClass(StockMovement);

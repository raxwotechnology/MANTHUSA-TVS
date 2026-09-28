import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type StoredDocument = DocumentRecord & Document;

@Schema({ timestamps: true })
export class DocumentRecord {
  @Prop({ required: true }) entityType: string;
  @Prop({ required: true }) entityId: string;
  @Prop({ required: true }) originalName: string;
  @Prop({ required: true, unique: true }) storageName: string;
  @Prop({ required: true }) mimeType: string;
  @Prop({ required: true }) size: number;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' }) uploadedBy: Types.ObjectId;
}

export const DocumentSchema = SchemaFactory.createForClass(DocumentRecord);

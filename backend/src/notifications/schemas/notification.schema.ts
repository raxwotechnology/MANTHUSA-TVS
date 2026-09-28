import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  recipient: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: 'info' })
  channel: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop()
  entityType: string;

  @Prop()
  entityId: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

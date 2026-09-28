import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type PermissionDocument = Permission & Document;

@Schema({ timestamps: true })
export class Permission {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Role', required: true })
  role: Types.ObjectId;

  @Prop({ required: true })
  module: string; // e.g. 'users', 'vehicles'

  @Prop({ default: false })
  canView: boolean;

  @Prop({ default: false })
  canCreate: boolean;

  @Prop({ default: false })
  canEdit: boolean;

  @Prop({ default: false })
  canDelete: boolean;

  @Prop({ default: false })
  canApprove: boolean;

  @Prop({ default: false })
  canExport: boolean;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);

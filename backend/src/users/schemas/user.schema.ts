import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Role', required: true })
  role: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Branch' })
  branch: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer' })
  customerId: Types.ObjectId;

  @Prop()
  phone: string;

  @Prop()
  avatar: string;

  @Prop()
  nic: string;

  @Prop()
  salary: number;

  @Prop([String])
  documents: string[];

  @Prop([String])
  permissions: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: true })
  emailVerified: boolean;

  @Prop({ default: false })
  mfaEnabled: boolean;

  @Prop()
  mfaSecret: string;

  @Prop([String])
  mfaBackupCodes: string[];

  @Prop()
  passwordResetTokenHash: string;

  @Prop()
  passwordResetExpiresAt: Date;

  @Prop()
  emailVerificationTokenHash: string;

  @Prop()
  emailVerificationExpiresAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

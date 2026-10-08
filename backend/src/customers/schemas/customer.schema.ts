import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema({ timestamps: true })
export class Customer {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', unique: true, sparse: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  fullName: string;

  @Prop()
  nicOrPassport: string;

  @Prop()
  dateOfBirth: Date;

  @Prop()
  gender: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  email: string;

  @Prop()
  address: string;

  @Prop()
  city: string;

  @Prop()
  occupation: string;

  @Prop()
  company: string;

  @Prop({ default: 'Individual' })
  customerType: string; // 'Individual', 'Company', 'Dealer', 'Corporate'
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

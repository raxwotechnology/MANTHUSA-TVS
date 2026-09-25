const fs = require('fs');
const path = require('path');

const schemas = {
  'customers/schemas/customer.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema({ timestamps: true })
export class Customer {
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
`,
  'leads/schemas/lead.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LeadDocument = Lead & Document;

@Schema({ timestamps: true })
export class Lead {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Vehicle' })
  interestedVehicle: Types.ObjectId;

  @Prop()
  source: string; // Facebook, Walk-in, Referral, etc.

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedStaff: Types.ObjectId;

  @Prop()
  budget: number;

  @Prop()
  expectedPurchaseDate: Date;

  @Prop({ default: 'New' })
  status: string; // New, Contacted, Interested, Test Drive, Quotation, Reserved, Won/Lost

  @Prop({ default: 'Medium' })
  priority: string; // High, Medium, Low
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
`,
  'lead-activities/schemas/lead-activity.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LeadActivityDocument = LeadActivity & Document;

@Schema({ timestamps: true })
export class LeadActivity {
  @Prop({ type: Types.ObjectId, ref: 'Lead', required: true })
  lead: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  performedBy: Types.ObjectId;

  @Prop({ required: true })
  activityType: string; // 'STATUS_CHANGE', 'NOTE_ADDED', 'FOLLOW_UP_CREATED', 'TEST_DRIVE_SCHEDULED'

  @Prop()
  oldStatus: string;

  @Prop()
  newStatus: string;

  @Prop()
  description: string;
}

export const LeadActivitySchema = SchemaFactory.createForClass(LeadActivity);
`,
  'follow-ups/schemas/follow-up.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FollowUpDocument = FollowUp & Document;

@Schema({ timestamps: true })
export class FollowUp {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Vehicle' })
  vehicle: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Lead' })
  lead: Types.ObjectId;

  @Prop({ required: true })
  followUpDate: Date;

  @Prop()
  followUpTime: string;

  @Prop({ required: true })
  type: string; // 'Phone', 'WhatsApp', 'Email', 'Meeting', 'Test Drive'

  @Prop()
  notes: string;

  @Prop({ default: 'Scheduled' })
  status: string; // 'Scheduled', 'Completed', 'Cancelled'

  @Prop()
  nextFollowUp: Date;
}

export const FollowUpSchema = SchemaFactory.createForClass(FollowUp);
`,
  'test-drives/schemas/test-drive.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TestDriveDocument = TestDrive & Document;

@Schema({ timestamps: true })
export class TestDrive {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Vehicle', required: true })
  vehicle: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  salesperson: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop()
  startTime: string;

  @Prop()
  endTime: string;

  @Prop()
  drivingLicenseNo: string;

  @Prop({ default: 'Scheduled' })
  status: string; // 'Scheduled', 'Completed', 'Cancelled', 'No Show'

  @Prop()
  feedback: string;
}

export const TestDriveSchema = SchemaFactory.createForClass(TestDrive);
`
};

for (const [relativePath, content] of Object.entries(schemas)) {
  const fullPath = path.join(__dirname, 'src', relativePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content);
}

console.log('Phase 3 Schemas generated');

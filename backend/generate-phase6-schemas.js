const fs = require('fs');
const path = require('path');

const schemas = {
  'vehicle-handovers/schemas/vehicle-handover.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VehicleHandoverDocument = VehicleHandover & Document;

@Schema({ timestamps: true })
export class VehicleHandover {
  @Prop({ type: Types.ObjectId, ref: 'Sale', required: true })
  sale: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Vehicle', required: true })
  vehicle: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({ type: Object })
  checklist: {
    vehicleInspection: boolean;
    keys: boolean;
    spareKey: boolean;
    cr: boolean;
    insurance: boolean;
    serviceBook: boolean;
    userManual: boolean;
    accessories: boolean;
    numberPlates: boolean;
    customerSignature: boolean;
  };

  @Prop({ default: 'Pending' })
  status: string; // 'Pending', 'Ready', 'Completed'

  @Prop()
  handoverDate: Date;
}

export const VehicleHandoverSchema = SchemaFactory.createForClass(VehicleHandover);
`,
  'after-sales/schemas/after-sales.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AfterSalesDocument = AfterSales & Document;

@Schema({ timestamps: true })
export class AfterSales {
  @Prop({ type: Types.ObjectId, ref: 'Sale', required: true })
  sale: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop()
  customerFeedback: string;

  @Prop({ type: Object })
  reminders: {
    serviceReminder: Date;
    warrantyReminder: Date;
    insuranceRenewalReminder: Date;
    revenueLicenseReminder: Date;
  };

  @Prop()
  nextFollowUp: Date;
}

export const AfterSalesSchema = SchemaFactory.createForClass(AfterSales);
`,
  'complaints/schemas/complaint.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ComplaintDocument = Complaint & Document;

@Schema({ timestamps: true })
export class Complaint {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Vehicle' })
  vehicle: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Sale' })
  sale: Types.ObjectId;

  @Prop({ required: true })
  priority: string; // 'Low', 'Medium', 'High', 'Critical'

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedStaff: Types.ObjectId;

  @Prop({ required: true })
  description: string;

  @Prop()
  resolution: string;

  @Prop({ default: 'Open' })
  status: string; // 'Open', 'In Progress', 'Resolved', 'Closed'
}

export const ComplaintSchema = SchemaFactory.createForClass(Complaint);
`,
  'commissions/schemas/commission.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CommissionDocument = Commission & Document;

@Schema({ timestamps: true })
export class Commission {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  salesperson: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Sale', required: true })
  sale: Types.ObjectId;

  @Prop({ required: true })
  commissionType: string; // 'Fixed Amount', 'Percentage', 'Target Based'

  @Prop()
  commissionPercentage: number;

  @Prop({ required: true })
  commissionAmount: number;

  @Prop({ default: 'Pending' })
  status: string; // 'Pending', 'Approved', 'Paid'

  @Prop()
  paidDate: Date;
}

export const CommissionSchema = SchemaFactory.createForClass(Commission);
`,
  'sales-targets/schemas/sales-target.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SalesTargetDocument = SalesTarget & Document;

@Schema({ timestamps: true })
export class SalesTarget {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  salesperson: Types.ObjectId;

  @Prop({ required: true })
  month: string; // e.g. 'YYYY-MM'

  @Prop({ required: true })
  vehicleTarget: number;

  @Prop({ required: true })
  revenueTarget: number;

  @Prop({ default: 0 })
  actualVehicles: number;

  @Prop({ default: 0 })
  actualRevenue: number;

  @Prop({ default: 0 })
  achievementPercentage: number;
}

export const SalesTargetSchema = SchemaFactory.createForClass(SalesTarget);
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

console.log('Phase 6 Schemas generated');

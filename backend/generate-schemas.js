const fs = require('fs');
const path = require('path');

const schemas = {
  'users/schemas/user.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ type: Types.ObjectId, ref: 'Role', required: true })
  role: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Branch' })
  branch: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
`,
  'roles/schemas/role.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema({ timestamps: true })
export class Role {
  @Prop({ required: true, unique: true })
  name: string; // 'Admin / Owner', 'Sales & Operations', 'Accountant / Finance'

  @Prop()
  description: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
`,
  'permissions/schemas/permission.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PermissionDocument = Permission & Document;

@Schema({ timestamps: true })
export class Permission {
  @Prop({ type: Types.ObjectId, ref: 'Role', required: true })
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
`,
  'branches/schemas/branch.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BranchDocument = Branch & Document;

@Schema({ timestamps: true })
export class Branch {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  location: string;

  @Prop()
  contactNumber: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
`,
  'settings/schemas/setting.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SettingDocument = Setting & Document;

@Schema({ timestamps: true })
export class Setting {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ type: Object, required: true })
  value: any;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
`,
  'audit-logs/schemas/audit-log.schema.ts': `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema({ timestamps: true })
export class AuditLog {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ required: true })
  action: string; // e.g. 'LOGIN', 'CREATE_USER'

  @Prop()
  entity: string;

  @Prop()
  entityId: string;

  @Prop({ type: Object })
  oldValue: any;

  @Prop({ type: Object })
  newValue: any;

  @Prop()
  ipAddress: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
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

console.log('Schemas generated');

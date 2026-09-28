import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuditLogsService {
  constructor(@InjectModel('AuditLog') private readonly logs: Model<any>) {}
  findAll(limit = 100) { return this.logs.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(Math.min(Math.max(limit, 1), 500)).exec(); }
}

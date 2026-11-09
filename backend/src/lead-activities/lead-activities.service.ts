import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class LeadActivitiesService {
  constructor(@InjectModel('LeadActivity') private readonly model: Model<any>) {}
  create(input: any) {
    const activityType = input.activityType || input.type || 'Note';
    if (!input.lead || !input.performedBy) throw new BadRequestException('Lead and user are required.');
    return new this.model({ ...input, activityType }).save();
  }
  findAll(lead?: string) { return this.model.find(lead ? { lead } : {}).populate('lead').populate('performedBy', 'name').sort({ createdAt: -1 }).exec(); }
}

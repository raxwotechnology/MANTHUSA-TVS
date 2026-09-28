import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class LeadActivitiesService {
  constructor(@InjectModel('LeadActivity') private readonly model: Model<any>) {}
  create(input: any) {
    if (!input.lead || !input.performedBy || !input.activityType) throw new BadRequestException('Lead, user and activity type are required.');
    return new this.model(input).save();
  }
  findAll(lead?: string) { return this.model.find(lead ? { lead } : {}).populate('lead').populate('performedBy', 'name').sort({ createdAt: -1 }).exec(); }
}

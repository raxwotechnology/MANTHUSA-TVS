import { Module } from '@nestjs/common';
import { LeadActivitiesController } from './lead-activities.controller';
import { LeadActivitiesService } from './lead-activities.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LeadActivitySchema } from './schemas/lead-activity.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'LeadActivity', schema: LeadActivitySchema }])],
  controllers: [LeadActivitiesController],
  providers: [LeadActivitiesService]
})
export class LeadActivitiesModule {}

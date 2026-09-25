import { Module } from '@nestjs/common';
import { LeadActivitiesController } from './lead-activities.controller';
import { LeadActivitiesService } from './lead-activities.service';

@Module({
  controllers: [LeadActivitiesController],
  providers: [LeadActivitiesService]
})
export class LeadActivitiesModule {}

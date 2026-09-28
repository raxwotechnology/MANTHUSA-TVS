import { Module } from '@nestjs/common';
import { FollowUpsController } from './follow-ups.controller';
import { FollowUpsService } from './follow-ups.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowUpSchema } from './schemas/follow-up.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'FollowUp', schema: FollowUpSchema }])],
  controllers: [FollowUpsController],
  providers: [FollowUpsService]
})
export class FollowUpsModule {}

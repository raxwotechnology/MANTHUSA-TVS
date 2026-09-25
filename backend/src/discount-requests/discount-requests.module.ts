import { Module } from '@nestjs/common';
import { DiscountRequestsController } from './discount-requests.controller';
import { DiscountRequestsService } from './discount-requests.service';

@Module({
  controllers: [DiscountRequestsController],
  providers: [DiscountRequestsService]
})
export class DiscountRequestsModule {}

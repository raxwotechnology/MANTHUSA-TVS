import { Module } from '@nestjs/common';
import { DiscountRequestsController } from './discount-requests.controller';
import { DiscountRequestsService } from './discount-requests.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscountRequestSchema } from './schemas/discount-request.schema';
import { QuotationSchema } from '../quotations/schemas/quotation.schema';
import { VehicleSchema } from '../vehicles/schemas/vehicle.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'DiscountRequest', schema: DiscountRequestSchema },
    { name: 'Quotation', schema: QuotationSchema },
    { name: 'Vehicle', schema: VehicleSchema },
  ])],
  controllers: [DiscountRequestsController],
  providers: [DiscountRequestsService]
})
export class DiscountRequestsModule {}

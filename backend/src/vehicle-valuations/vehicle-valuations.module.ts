import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VehicleValuationsService } from './vehicle-valuations.service';
import { VehicleValuationsController } from './vehicle-valuations.controller';
import { VehicleValuationSchema } from './schemas/vehicle-valuation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'VehicleValuation', schema: VehicleValuationSchema }]),
  ],
  providers: [VehicleValuationsService],
  controllers: [VehicleValuationsController],
  exports: [VehicleValuationsService],
})
export class VehicleValuationsModule {}

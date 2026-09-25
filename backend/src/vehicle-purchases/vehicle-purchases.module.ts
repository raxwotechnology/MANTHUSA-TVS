import { Module } from '@nestjs/common';
import { VehiclePurchasesController } from './vehicle-purchases.controller';
import { VehiclePurchasesService } from './vehicle-purchases.service';

@Module({
  controllers: [VehiclePurchasesController],
  providers: [VehiclePurchasesService]
})
export class VehiclePurchasesModule {}

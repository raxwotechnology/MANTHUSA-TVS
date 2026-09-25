import { Module } from '@nestjs/common';
import { VehicleHandoversController } from './vehicle-handovers.controller';
import { VehicleHandoversService } from './vehicle-handovers.service';

@Module({
  controllers: [VehicleHandoversController],
  providers: [VehicleHandoversService]
})
export class VehicleHandoversModule {}

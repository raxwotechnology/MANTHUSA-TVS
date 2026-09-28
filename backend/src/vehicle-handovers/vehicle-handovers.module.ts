import { Module } from '@nestjs/common';
import { VehicleHandoversController } from './vehicle-handovers.controller';
import { VehicleHandoversService } from './vehicle-handovers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { VehicleHandoverSchema } from './schemas/vehicle-handover.schema';
import { SaleSchema } from '../sales/schemas/sale.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'VehicleHandover', schema: VehicleHandoverSchema },
    { name: 'Sale', schema: SaleSchema },
  ])],
  controllers: [VehicleHandoversController],
  providers: [VehicleHandoversService]
})
export class VehicleHandoversModule {}

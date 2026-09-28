import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { PublicVehiclesController } from './public-vehicles.controller';
import { VehicleSchema } from './schemas/vehicle.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Vehicle', schema: VehicleSchema }])
  ],
  controllers: [VehiclesController, PublicVehiclesController],
  providers: [VehiclesService]
})
export class VehiclesModule {}

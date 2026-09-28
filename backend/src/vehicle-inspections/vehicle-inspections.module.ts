import { Module } from '@nestjs/common';
import { VehicleInspectionsController } from './vehicle-inspections.controller';
import { VehicleInspectionsService } from './vehicle-inspections.service';
import { MongooseModule } from '@nestjs/mongoose';
import { VehicleInspectionSchema } from './schemas/vehicle-inspection.schema';
import { VehicleSchema } from '../vehicles/schemas/vehicle.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'VehicleInspection', schema: VehicleInspectionSchema },
    { name: 'Vehicle', schema: VehicleSchema },
  ])],
  controllers: [VehicleInspectionsController],
  providers: [VehicleInspectionsService]
})
export class VehicleInspectionsModule {}

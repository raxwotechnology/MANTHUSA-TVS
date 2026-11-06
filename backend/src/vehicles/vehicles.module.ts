import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { PublicVehiclesController } from './public-vehicles.controller';
import { VehicleSchema } from './schemas/vehicle.schema';
import { NotificationsModule } from '../notifications/notifications.module';
import { SaleSchema } from '../sales/schemas/sale.schema';
import { CustomerSchema } from '../customers/schemas/customer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Vehicle', schema: VehicleSchema },
      { name: 'Sale', schema: SaleSchema },
      { name: 'Customer', schema: CustomerSchema },
    ]),
    NotificationsModule,
  ],
  controllers: [VehiclesController, PublicVehiclesController],
  providers: [VehiclesService]
})
export class VehiclesModule {}

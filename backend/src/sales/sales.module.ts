import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { SaleSchema } from './schemas/sale.schema';
import { VehicleSchema } from '../vehicles/schemas/vehicle.schema';
import { NotificationsModule } from '../notifications/notifications.module';
import { ReservationSchema } from '../reservations/schemas/reservation.schema';

@Module({
  imports: [
    NotificationsModule, MongooseModule.forFeature([
      { name: 'Sale', schema: SaleSchema },
      { name: 'Vehicle', schema: VehicleSchema },
      { name: 'Reservation', schema: ReservationSchema },
    ])
  ],
  controllers: [SalesController],
  providers: [SalesService]
})
export class SalesModule {}

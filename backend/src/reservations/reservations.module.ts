import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationSchema } from './schemas/reservation.schema';
import { VehicleSchema } from '../vehicles/schemas/vehicle.schema';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule, MongooseModule.forFeature([
    { name: 'Reservation', schema: ReservationSchema },
    { name: 'Vehicle', schema: VehicleSchema },
  ])],
  controllers: [ReservationsController],
  providers: [ReservationsService]
})
export class ReservationsModule {}

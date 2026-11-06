import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { LeadSchema } from './schemas/lead.schema';
import { NotificationsModule } from '../notifications/notifications.module';
import { CustomerSchema } from '../customers/schemas/customer.schema';
import { VehicleSchema } from '../vehicles/schemas/vehicle.schema';
import { ReservationSchema } from '../reservations/schemas/reservation.schema';
import { SaleSchema } from '../sales/schemas/sale.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Lead', schema: LeadSchema },
      { name: 'Customer', schema: CustomerSchema },
      { name: 'Vehicle', schema: VehicleSchema },
      { name: 'Reservation', schema: ReservationSchema },
      { name: 'Sale', schema: SaleSchema },
    ]),
    NotificationsModule,
  ],
  controllers: [LeadsController],
  providers: [LeadsService],
  exports: [LeadsService],
})
export class LeadsModule {}

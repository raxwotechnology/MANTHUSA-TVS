import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuotationsController } from './quotations.controller';
import { QuotationsService } from './quotations.service';
import { QuotationSchema } from './schemas/quotation.schema';
import { SaleSchema } from '../sales/schemas/sale.schema';
import { ReservationSchema } from '../reservations/schemas/reservation.schema';
import { VehicleSchema } from '../vehicles/schemas/vehicle.schema';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Quotation', schema: QuotationSchema },
      { name: 'Sale', schema: SaleSchema },
      { name: 'Reservation', schema: ReservationSchema },
      { name: 'Vehicle', schema: VehicleSchema },
    ]),
    NotificationsModule,
  ],
  controllers: [QuotationsController],
  providers: [QuotationsService],
  exports: [QuotationsService],
})
export class QuotationsModule {}

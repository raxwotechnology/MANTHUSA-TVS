import { Module } from '@nestjs/common';
import { RefundsController } from './refunds.controller';
import { RefundsService } from './refunds.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RefundSchema } from './schemas/refund.schema';
import { SaleSchema } from '../sales/schemas/sale.schema';
import { ReservationSchema } from '../reservations/schemas/reservation.schema';
import { CashTransactionSchema } from '../cash-transactions/schemas/cash-transaction.schema';
import { VehicleSchema } from '../vehicles/schemas/vehicle.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Refund', schema: RefundSchema },
    { name: 'Sale', schema: SaleSchema },
    { name: 'Reservation', schema: ReservationSchema },
    { name: 'CashTransaction', schema: CashTransactionSchema },
    { name: 'Vehicle', schema: VehicleSchema },
  ])],
  controllers: [RefundsController],
  providers: [RefundsService]
})
export class RefundsModule {}

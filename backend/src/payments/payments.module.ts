import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentSchema } from './schemas/payment.schema';
import { SaleSchema } from '../sales/schemas/sale.schema';
import { CashTransactionSchema } from '../cash-transactions/schemas/cash-transaction.schema';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule, MongooseModule.forFeature([
    { name: 'Payment', schema: PaymentSchema },
    { name: 'Sale', schema: SaleSchema },
    { name: 'CashTransaction', schema: CashTransactionSchema },
  ])],
  controllers: [PaymentsController],
  providers: [PaymentsService]
})
export class PaymentsModule {}

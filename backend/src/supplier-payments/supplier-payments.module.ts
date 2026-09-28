import { Module } from '@nestjs/common';
import { SupplierPaymentsController } from './supplier-payments.controller';
import { SupplierPaymentsService } from './supplier-payments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SupplierPaymentSchema } from './schemas/supplier-payment.schema';
import { SupplierSchema } from '../suppliers/schemas/supplier.schema';
import { CashTransactionSchema } from '../cash-transactions/schemas/cash-transaction.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'SupplierPayment', schema: SupplierPaymentSchema },
    { name: 'Supplier', schema: SupplierSchema },
    { name: 'CashTransaction', schema: CashTransactionSchema },
  ])],
  controllers: [SupplierPaymentsController],
  providers: [SupplierPaymentsService]
})
export class SupplierPaymentsModule {}

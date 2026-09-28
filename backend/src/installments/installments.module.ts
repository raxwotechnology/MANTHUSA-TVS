import { Module } from '@nestjs/common';
import { InstallmentsController } from './installments.controller';
import { InstallmentsService } from './installments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { InstallmentSchema } from './schemas/installment.schema';
import { InstallmentAgreementSchema } from './schemas/installment-agreement.schema';
import { SaleSchema } from '../sales/schemas/sale.schema';
import { CashTransactionSchema } from '../cash-transactions/schemas/cash-transaction.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Installment', schema: InstallmentSchema },
    { name: 'InstallmentAgreement', schema: InstallmentAgreementSchema },
    { name: 'Sale', schema: SaleSchema },
    { name: 'CashTransaction', schema: CashTransactionSchema },
  ])],
  controllers: [InstallmentsController],
  providers: [InstallmentsService]
})
export class InstallmentsModule {}

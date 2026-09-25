import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CashTransactionsController } from './cash-transactions.controller';
import { CashTransactionsService } from './cash-transactions.service';
import { CashTransactionSchema } from './schemas/cash-transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'CashTransaction', schema: CashTransactionSchema }])
  ],
  controllers: [CashTransactionsController],
  providers: [CashTransactionsService]
})
export class CashTransactionsModule {}

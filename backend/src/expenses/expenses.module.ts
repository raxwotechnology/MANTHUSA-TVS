import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { ExpenseSchema } from './schemas/expense.schema';
import { ExpenseCategorySchema } from '../expense-categories/schemas/expense-category.schema';
import { CashTransactionSchema } from '../cash-transactions/schemas/cash-transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Expense', schema: ExpenseSchema },
      { name: 'ExpenseCategory', schema: ExpenseCategorySchema },
      { name: 'CashTransaction', schema: CashTransactionSchema },
    ])
  ],
  controllers: [ExpensesController],
  providers: [ExpensesService]
})
export class ExpensesModule {}

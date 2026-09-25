import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { VehicleSchema } from '../vehicles/schemas/vehicle.schema';
import { CustomerSchema } from '../customers/schemas/customer.schema';
import { LeadSchema } from '../leads/schemas/lead.schema';
import { SaleSchema } from '../sales/schemas/sale.schema';
import { ExpenseSchema } from '../expenses/schemas/expense.schema';
import { SupplierSchema } from '../suppliers/schemas/supplier.schema';
import { CashTransactionSchema } from '../cash-transactions/schemas/cash-transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Vehicle', schema: VehicleSchema },
      { name: 'Customer', schema: CustomerSchema },
      { name: 'Lead', schema: LeadSchema },
      { name: 'Sale', schema: SaleSchema },
      { name: 'Expense', schema: ExpenseSchema },
      { name: 'Supplier', schema: SupplierSchema },
      { name: 'CashTransaction', schema: CashTransactionSchema }
    ])
  ],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule {}

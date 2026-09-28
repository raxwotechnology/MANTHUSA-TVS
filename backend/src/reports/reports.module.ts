import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SaleSchema } from '../sales/schemas/sale.schema';
import { VehicleSchema } from '../vehicles/schemas/vehicle.schema';
import { ExpenseSchema } from '../expenses/schemas/expense.schema';
import { BranchSchema } from '../branches/schemas/branch.schema';
import { LeadSchema } from '../leads/schemas/lead.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Sale', schema: SaleSchema },
    { name: 'Vehicle', schema: VehicleSchema },
    { name: 'Expense', schema: ExpenseSchema },
    { name: 'Branch', schema: BranchSchema },
    { name: 'Lead', schema: LeadSchema },
  ])],
  controllers: [ReportsController],
  providers: [ReportsService]
})
export class ReportsModule {}

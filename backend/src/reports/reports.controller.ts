import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Roles } from '../auth/roles.decorator';

@Controller('reports')
@Roles('Accountant / Finance Staff', 'Inventory Manager', 'Sales & Operations', 'Admin / Owner')
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  @Get('summary')
  summary(@Query('from') from?: string, @Query('to') to?: string) {
    return this.reports.summary(from, to);
  }

  @Get('financial-analysis')
  @Roles('Accountant / Finance Staff', 'Admin / Owner')
  financialAnalysis(@Query('targetGrowth') targetGrowth?: string) {
    return this.reports.financialAnalysis(targetGrowth ? Number(targetGrowth) : 15);
  }

  @Get('customer-acquisition')
  customerAcquisition() {
    return this.reports.customerAcquisition();
  }

  @Get('sales-by-month')
  salesByMonth(@Query('year') year?: string) {
    return this.reports.salesByMonth(year ? Number(year) : new Date().getFullYear());
  }

  @Get('aging-stock')
  agingStock() {
    return this.reports.agingStock();
  }

  @Get('profit-loss')
  @Roles('Accountant / Finance Staff', 'Admin / Owner')
  profitLoss(@Query('from') from?: string, @Query('to') to?: string) {
    return this.reports.profitLoss(from, to);
  }

  @Get('by-branch')
  byBranch(@Query('from') from?: string, @Query('to') to?: string) {
    return this.reports.byBranch(from, to);
  }

  @Get('sales-by-category')
  salesByCategory(@Query('year') year?: string) {
    return this.reports.salesByCategory(year ? Number(year) : new Date().getFullYear());
  }

  @Get('lead-conversion')
  leadConversion() {
    return this.reports.leadConversion();
  }

  @Get('accounting-export')
  @Roles('Accountant / Finance Staff', 'Admin / Owner')
  accountingExport(@Query('format') format?: string) {
    return this.reports.accountingExport(format);
  }
}

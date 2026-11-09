import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { BranchesModule } from './branches/branches.module';
import { SettingsModule } from './settings/settings.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { VehicleInspectionsModule } from './vehicle-inspections/vehicle-inspections.module';
import { VehiclePurchasesModule } from './vehicle-purchases/vehicle-purchases.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { SupplierPaymentsModule } from './supplier-payments/supplier-payments.module';
import { CustomersModule } from './customers/customers.module';
import { LeadsModule } from './leads/leads.module';
import { LeadActivitiesModule } from './lead-activities/lead-activities.module';
import { FollowUpsModule } from './follow-ups/follow-ups.module';
import { TestDrivesModule } from './test-drives/test-drives.module';
import { QuotationsModule } from './quotations/quotations.module';
import { DiscountRequestsModule } from './discount-requests/discount-requests.module';
import { ReservationsModule } from './reservations/reservations.module';
import { SalesModule } from './sales/sales.module';
import { PaymentsModule } from './payments/payments.module';
import { InstallmentsModule } from './installments/installments.module';
import { RefundsModule } from './refunds/refunds.module';
import { ExpensesModule } from './expenses/expenses.module';
import { ExpenseCategoriesModule } from './expense-categories/expense-categories.module';
import { CashTransactionsModule } from './cash-transactions/cash-transactions.module';
import { VehicleHandoversModule } from './vehicle-handovers/vehicle-handovers.module';
import { AfterSalesModule } from './after-sales/after-sales.module';
import { ComplaintsModule } from './complaints/complaints.module';
import { CommissionsModule } from './commissions/commissions.module';
import { SalesTargetsModule } from './sales-targets/sales-targets.module';
import { ReportsModule } from './reports/reports.module';
import { DashboardModule } from './dashboard/dashboard.module';

import { VehicleTransfersModule } from './vehicle-transfers/vehicle-transfers.module';
import { VehicleValuationsModule } from './vehicle-valuations/vehicle-valuations.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DocumentsModule } from './documents/documents.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { StockMovementsModule } from './stock-movements/stock-movements.module';
import { LeasingPartnersModule } from './leasing-partners/leasing-partners.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGO_URI') ||
          process.env.MONGO_URI ||
          'mongodb+srv://raxwotechnology_db_user:0Bk8CNwvPAenfq1y@cluster0.nziv5e7.mongodb.net/?retryWrites=true&w=majority',
        serverSelectionTimeoutMS: 10000,
        driverInfo: { name: 'salesplus', version: '1.0.0' },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    BranchesModule,
    SettingsModule,
    AuditLogsModule,
    VehiclesModule,
    VehicleInspectionsModule,
    VehiclePurchasesModule,
    VehicleTransfersModule,
    VehicleValuationsModule,
    NotificationsModule,
    DocumentsModule,
    CloudinaryModule,
    StockMovementsModule,
    LeasingPartnersModule,
    SuppliersModule,
    SupplierPaymentsModule,
    CustomersModule,
    LeadsModule,
    LeadActivitiesModule,
    FollowUpsModule,
    TestDrivesModule,
    QuotationsModule,
    DiscountRequestsModule,
    ReservationsModule,
    SalesModule,
    PaymentsModule,
    InstallmentsModule,
    RefundsModule,
    ExpensesModule,
    ExpenseCategoriesModule,
    CashTransactionsModule,
    VehicleHandoversModule,
    AfterSalesModule,
    ComplaintsModule,
    CommissionsModule,
    SalesTargetsModule,
    ReportsModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const roles_module_1 = require("./roles/roles.module");
const permissions_module_1 = require("./permissions/permissions.module");
const branches_module_1 = require("./branches/branches.module");
const settings_module_1 = require("./settings/settings.module");
const audit_logs_module_1 = require("./audit-logs/audit-logs.module");
const vehicles_module_1 = require("./vehicles/vehicles.module");
const vehicle_inspections_module_1 = require("./vehicle-inspections/vehicle-inspections.module");
const vehicle_purchases_module_1 = require("./vehicle-purchases/vehicle-purchases.module");
const suppliers_module_1 = require("./suppliers/suppliers.module");
const supplier_payments_module_1 = require("./supplier-payments/supplier-payments.module");
const customers_module_1 = require("./customers/customers.module");
const leads_module_1 = require("./leads/leads.module");
const lead_activities_module_1 = require("./lead-activities/lead-activities.module");
const follow_ups_module_1 = require("./follow-ups/follow-ups.module");
const test_drives_module_1 = require("./test-drives/test-drives.module");
const quotations_module_1 = require("./quotations/quotations.module");
const discount_requests_module_1 = require("./discount-requests/discount-requests.module");
const reservations_module_1 = require("./reservations/reservations.module");
const sales_module_1 = require("./sales/sales.module");
const payments_module_1 = require("./payments/payments.module");
const installments_module_1 = require("./installments/installments.module");
const refunds_module_1 = require("./refunds/refunds.module");
const expenses_module_1 = require("./expenses/expenses.module");
const expense_categories_module_1 = require("./expense-categories/expense-categories.module");
const cash_transactions_module_1 = require("./cash-transactions/cash-transactions.module");
const vehicle_handovers_module_1 = require("./vehicle-handovers/vehicle-handovers.module");
const after_sales_module_1 = require("./after-sales/after-sales.module");
const complaints_module_1 = require("./complaints/complaints.module");
const commissions_module_1 = require("./commissions/commissions.module");
const sales_targets_module_1 = require("./sales-targets/sales-targets.module");
const reports_module_1 = require("./reports/reports.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const vehicle_transfers_module_1 = require("./vehicle-transfers/vehicle-transfers.module");
const vehicle_valuations_module_1 = require("./vehicle-valuations/vehicle-valuations.module");
const notifications_module_1 = require("./notifications/notifications.module");
const documents_module_1 = require("./documents/documents.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    uri: configService.get('MONGO_URI') || 'mongodb://localhost:27017/salesplus',
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            roles_module_1.RolesModule,
            permissions_module_1.PermissionsModule,
            branches_module_1.BranchesModule,
            settings_module_1.SettingsModule,
            audit_logs_module_1.AuditLogsModule,
            vehicles_module_1.VehiclesModule,
            vehicle_inspections_module_1.VehicleInspectionsModule,
            vehicle_purchases_module_1.VehiclePurchasesModule,
            vehicle_transfers_module_1.VehicleTransfersModule,
            vehicle_valuations_module_1.VehicleValuationsModule,
            notifications_module_1.NotificationsModule,
            documents_module_1.DocumentsModule,
            suppliers_module_1.SuppliersModule,
            supplier_payments_module_1.SupplierPaymentsModule,
            customers_module_1.CustomersModule,
            leads_module_1.LeadsModule,
            lead_activities_module_1.LeadActivitiesModule,
            follow_ups_module_1.FollowUpsModule,
            test_drives_module_1.TestDrivesModule,
            quotations_module_1.QuotationsModule,
            discount_requests_module_1.DiscountRequestsModule,
            reservations_module_1.ReservationsModule,
            sales_module_1.SalesModule,
            payments_module_1.PaymentsModule,
            installments_module_1.InstallmentsModule,
            refunds_module_1.RefundsModule,
            expenses_module_1.ExpensesModule,
            expense_categories_module_1.ExpenseCategoriesModule,
            cash_transactions_module_1.CashTransactionsModule,
            vehicle_handovers_module_1.VehicleHandoversModule,
            after_sales_module_1.AfterSalesModule,
            complaints_module_1.ComplaintsModule,
            commissions_module_1.CommissionsModule,
            sales_targets_module_1.SalesTargetsModule,
            reports_module_1.ReportsModule,
            dashboard_module_1.DashboardModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
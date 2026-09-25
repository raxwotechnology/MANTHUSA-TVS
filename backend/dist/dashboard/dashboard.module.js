"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const dashboard_controller_1 = require("./dashboard.controller");
const dashboard_service_1 = require("./dashboard.service");
const vehicle_schema_1 = require("../vehicles/schemas/vehicle.schema");
const customer_schema_1 = require("../customers/schemas/customer.schema");
const lead_schema_1 = require("../leads/schemas/lead.schema");
const sale_schema_1 = require("../sales/schemas/sale.schema");
const expense_schema_1 = require("../expenses/schemas/expense.schema");
const supplier_schema_1 = require("../suppliers/schemas/supplier.schema");
const cash_transaction_schema_1 = require("../cash-transactions/schemas/cash-transaction.schema");
let DashboardModule = class DashboardModule {
};
exports.DashboardModule = DashboardModule;
exports.DashboardModule = DashboardModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'Vehicle', schema: vehicle_schema_1.VehicleSchema },
                { name: 'Customer', schema: customer_schema_1.CustomerSchema },
                { name: 'Lead', schema: lead_schema_1.LeadSchema },
                { name: 'Sale', schema: sale_schema_1.SaleSchema },
                { name: 'Expense', schema: expense_schema_1.ExpenseSchema },
                { name: 'Supplier', schema: supplier_schema_1.SupplierSchema },
                { name: 'CashTransaction', schema: cash_transaction_schema_1.CashTransactionSchema }
            ])
        ],
        controllers: [dashboard_controller_1.DashboardController],
        providers: [dashboard_service_1.DashboardService]
    })
], DashboardModule);
//# sourceMappingURL=dashboard.module.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsModule = void 0;
const common_1 = require("@nestjs/common");
const reports_controller_1 = require("./reports.controller");
const reports_service_1 = require("./reports.service");
const mongoose_1 = require("@nestjs/mongoose");
const sale_schema_1 = require("../sales/schemas/sale.schema");
const vehicle_schema_1 = require("../vehicles/schemas/vehicle.schema");
const expense_schema_1 = require("../expenses/schemas/expense.schema");
const branch_schema_1 = require("../branches/schemas/branch.schema");
const lead_schema_1 = require("../leads/schemas/lead.schema");
let ReportsModule = class ReportsModule {
};
exports.ReportsModule = ReportsModule;
exports.ReportsModule = ReportsModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([
                { name: 'Sale', schema: sale_schema_1.SaleSchema },
                { name: 'Vehicle', schema: vehicle_schema_1.VehicleSchema },
                { name: 'Expense', schema: expense_schema_1.ExpenseSchema },
                { name: 'Branch', schema: branch_schema_1.BranchSchema },
                { name: 'Lead', schema: lead_schema_1.LeadSchema },
            ])],
        controllers: [reports_controller_1.ReportsController],
        providers: [reports_service_1.ReportsService]
    })
], ReportsModule);
//# sourceMappingURL=reports.module.js.map
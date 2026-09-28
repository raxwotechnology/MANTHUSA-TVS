"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const customers_controller_1 = require("./customers.controller");
const customers_service_1 = require("./customers.service");
const customer_schema_1 = require("./schemas/customer.schema");
const lead_schema_1 = require("../leads/schemas/lead.schema");
const follow_up_schema_1 = require("../follow-ups/schemas/follow-up.schema");
const test_drive_schema_1 = require("../test-drives/schemas/test-drive.schema");
const quotation_schema_1 = require("../quotations/schemas/quotation.schema");
const reservation_schema_1 = require("../reservations/schemas/reservation.schema");
const payment_schema_1 = require("../payments/schemas/payment.schema");
const sale_schema_1 = require("../sales/schemas/sale.schema");
const vehicle_handover_schema_1 = require("../vehicle-handovers/schemas/vehicle-handover.schema");
const complaint_schema_1 = require("../complaints/schemas/complaint.schema");
const after_sales_schema_1 = require("../after-sales/schemas/after-sales.schema");
let CustomersModule = class CustomersModule {
};
exports.CustomersModule = CustomersModule;
exports.CustomersModule = CustomersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'Customer', schema: customer_schema_1.CustomerSchema }, { name: 'Lead', schema: lead_schema_1.LeadSchema },
                { name: 'FollowUp', schema: follow_up_schema_1.FollowUpSchema }, { name: 'TestDrive', schema: test_drive_schema_1.TestDriveSchema },
                { name: 'Quotation', schema: quotation_schema_1.QuotationSchema }, { name: 'Reservation', schema: reservation_schema_1.ReservationSchema },
                { name: 'Payment', schema: payment_schema_1.PaymentSchema }, { name: 'Sale', schema: sale_schema_1.SaleSchema },
                { name: 'VehicleHandover', schema: vehicle_handover_schema_1.VehicleHandoverSchema }, { name: 'Complaint', schema: complaint_schema_1.ComplaintSchema },
                { name: 'AfterSales', schema: after_sales_schema_1.AfterSalesSchema },
            ])
        ],
        controllers: [customers_controller_1.CustomersController],
        providers: [customers_service_1.CustomersService]
    })
], CustomersModule);
//# sourceMappingURL=customers.module.js.map
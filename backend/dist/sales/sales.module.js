"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const sales_controller_1 = require("./sales.controller");
const sales_service_1 = require("./sales.service");
const sale_schema_1 = require("./schemas/sale.schema");
const vehicle_schema_1 = require("../vehicles/schemas/vehicle.schema");
const notifications_module_1 = require("../notifications/notifications.module");
const reservation_schema_1 = require("../reservations/schemas/reservation.schema");
const customer_schema_1 = require("../customers/schemas/customer.schema");
let SalesModule = class SalesModule {
};
exports.SalesModule = SalesModule;
exports.SalesModule = SalesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            notifications_module_1.NotificationsModule, mongoose_1.MongooseModule.forFeature([
                { name: 'Sale', schema: sale_schema_1.SaleSchema },
                { name: 'Vehicle', schema: vehicle_schema_1.VehicleSchema },
                { name: 'Reservation', schema: reservation_schema_1.ReservationSchema },
                { name: 'Customer', schema: customer_schema_1.CustomerSchema },
            ])
        ],
        controllers: [sales_controller_1.SalesController],
        providers: [sales_service_1.SalesService]
    })
], SalesModule);
//# sourceMappingURL=sales.module.js.map
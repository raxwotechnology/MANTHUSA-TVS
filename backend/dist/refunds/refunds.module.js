"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundsModule = void 0;
const common_1 = require("@nestjs/common");
const refunds_controller_1 = require("./refunds.controller");
const refunds_service_1 = require("./refunds.service");
const mongoose_1 = require("@nestjs/mongoose");
const refund_schema_1 = require("./schemas/refund.schema");
const sale_schema_1 = require("../sales/schemas/sale.schema");
const reservation_schema_1 = require("../reservations/schemas/reservation.schema");
const cash_transaction_schema_1 = require("../cash-transactions/schemas/cash-transaction.schema");
let RefundsModule = class RefundsModule {
};
exports.RefundsModule = RefundsModule;
exports.RefundsModule = RefundsModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([
                { name: 'Refund', schema: refund_schema_1.RefundSchema },
                { name: 'Sale', schema: sale_schema_1.SaleSchema },
                { name: 'Reservation', schema: reservation_schema_1.ReservationSchema },
                { name: 'CashTransaction', schema: cash_transaction_schema_1.CashTransactionSchema },
            ])],
        controllers: [refunds_controller_1.RefundsController],
        providers: [refunds_service_1.RefundsService]
    })
], RefundsModule);
//# sourceMappingURL=refunds.module.js.map
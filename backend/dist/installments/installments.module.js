"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstallmentsModule = void 0;
const common_1 = require("@nestjs/common");
const installments_controller_1 = require("./installments.controller");
const installments_service_1 = require("./installments.service");
const mongoose_1 = require("@nestjs/mongoose");
const installment_schema_1 = require("./schemas/installment.schema");
const installment_agreement_schema_1 = require("./schemas/installment-agreement.schema");
const sale_schema_1 = require("../sales/schemas/sale.schema");
const cash_transaction_schema_1 = require("../cash-transactions/schemas/cash-transaction.schema");
let InstallmentsModule = class InstallmentsModule {
};
exports.InstallmentsModule = InstallmentsModule;
exports.InstallmentsModule = InstallmentsModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([
                { name: 'Installment', schema: installment_schema_1.InstallmentSchema },
                { name: 'InstallmentAgreement', schema: installment_agreement_schema_1.InstallmentAgreementSchema },
                { name: 'Sale', schema: sale_schema_1.SaleSchema },
                { name: 'CashTransaction', schema: cash_transaction_schema_1.CashTransactionSchema },
            ])],
        controllers: [installments_controller_1.InstallmentsController],
        providers: [installments_service_1.InstallmentsService]
    })
], InstallmentsModule);
//# sourceMappingURL=installments.module.js.map
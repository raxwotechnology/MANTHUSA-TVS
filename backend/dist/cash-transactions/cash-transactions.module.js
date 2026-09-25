"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashTransactionsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const cash_transactions_controller_1 = require("./cash-transactions.controller");
const cash_transactions_service_1 = require("./cash-transactions.service");
const cash_transaction_schema_1 = require("./schemas/cash-transaction.schema");
let CashTransactionsModule = class CashTransactionsModule {
};
exports.CashTransactionsModule = CashTransactionsModule;
exports.CashTransactionsModule = CashTransactionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'CashTransaction', schema: cash_transaction_schema_1.CashTransactionSchema }])
        ],
        controllers: [cash_transactions_controller_1.CashTransactionsController],
        providers: [cash_transactions_service_1.CashTransactionsService]
    })
], CashTransactionsModule);
//# sourceMappingURL=cash-transactions.module.js.map
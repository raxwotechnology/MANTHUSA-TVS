"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehiclePurchasesModule = void 0;
const common_1 = require("@nestjs/common");
const vehicle_purchases_controller_1 = require("./vehicle-purchases.controller");
const vehicle_purchases_service_1 = require("./vehicle-purchases.service");
const mongoose_1 = require("@nestjs/mongoose");
const vehicle_purchase_schema_1 = require("./schemas/vehicle-purchase.schema");
const vehicle_schema_1 = require("../vehicles/schemas/vehicle.schema");
const supplier_schema_1 = require("../suppliers/schemas/supplier.schema");
const cash_transaction_schema_1 = require("../cash-transactions/schemas/cash-transaction.schema");
let VehiclePurchasesModule = class VehiclePurchasesModule {
};
exports.VehiclePurchasesModule = VehiclePurchasesModule;
exports.VehiclePurchasesModule = VehiclePurchasesModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([
                { name: 'VehiclePurchase', schema: vehicle_purchase_schema_1.VehiclePurchaseSchema },
                { name: 'Vehicle', schema: vehicle_schema_1.VehicleSchema },
                { name: 'Supplier', schema: supplier_schema_1.SupplierSchema },
                { name: 'CashTransaction', schema: cash_transaction_schema_1.CashTransactionSchema },
            ])],
        controllers: [vehicle_purchases_controller_1.VehiclePurchasesController],
        providers: [vehicle_purchases_service_1.VehiclePurchasesService]
    })
], VehiclePurchasesModule);
//# sourceMappingURL=vehicle-purchases.module.js.map
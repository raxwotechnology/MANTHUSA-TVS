"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleTransfersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const vehicle_transfers_service_1 = require("./vehicle-transfers.service");
const vehicle_transfers_controller_1 = require("./vehicle-transfers.controller");
const vehicle_transfer_schema_1 = require("./schemas/vehicle-transfer.schema");
const vehicle_schema_1 = require("../vehicles/schemas/vehicle.schema");
const branch_schema_1 = require("../branches/schemas/branch.schema");
let VehicleTransfersModule = class VehicleTransfersModule {
};
exports.VehicleTransfersModule = VehicleTransfersModule;
exports.VehicleTransfersModule = VehicleTransfersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'VehicleTransfer', schema: vehicle_transfer_schema_1.VehicleTransferSchema },
                { name: 'Vehicle', schema: vehicle_schema_1.VehicleSchema },
                { name: 'Branch', schema: branch_schema_1.BranchSchema },
            ]),
        ],
        providers: [vehicle_transfers_service_1.VehicleTransfersService],
        controllers: [vehicle_transfers_controller_1.VehicleTransfersController],
        exports: [vehicle_transfers_service_1.VehicleTransfersService],
    })
], VehicleTransfersModule);
//# sourceMappingURL=vehicle-transfers.module.js.map
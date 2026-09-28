"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockMovementsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let StockMovementsService = class StockMovementsService {
    stockMovementModel;
    constructor(stockMovementModel) {
        this.stockMovementModel = stockMovementModel;
    }
    async create(dto) {
        const record = new this.stockMovementModel(dto);
        return record.save();
    }
    async findByVehicle(vehicleId) {
        return this.stockMovementModel
            .find({ vehicle: vehicleId })
            .populate('fromBranch toBranch updatedBy', 'name email')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findAll() {
        return this.stockMovementModel
            .find()
            .populate('vehicle fromBranch toBranch updatedBy', 'make model stockNumber registrationNumber name email')
            .sort({ createdAt: -1 })
            .limit(100)
            .exec();
    }
};
exports.StockMovementsService = StockMovementsService;
exports.StockMovementsService = StockMovementsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('StockMovement')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], StockMovementsService);
//# sourceMappingURL=stock-movements.service.js.map
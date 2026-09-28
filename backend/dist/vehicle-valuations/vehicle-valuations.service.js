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
exports.VehicleValuationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let VehicleValuationsService = class VehicleValuationsService {
    valuationModel;
    constructor(valuationModel) {
        this.valuationModel = valuationModel;
    }
    async create(createDto) {
        createDto.valuationId = createDto.valuationId || `VAL-${Date.now()}`;
        const created = new this.valuationModel(createDto);
        return created.save();
    }
    async findAll() {
        return this.valuationModel.find().exec();
    }
    async findOne(id) {
        const item = await this.valuationModel.findById(id).exec();
        if (!item)
            throw new common_1.NotFoundException(`Valuation #${id} not found`);
        return item;
    }
    async update(id, updateDto) {
        const item = await this.valuationModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
        if (!item)
            throw new common_1.NotFoundException(`Valuation #${id} not found`);
        return item;
    }
    async remove(id) {
        const item = await this.valuationModel.findByIdAndDelete(id).exec();
        if (!item)
            throw new common_1.NotFoundException(`Valuation #${id} not found`);
        return item;
    }
};
exports.VehicleValuationsService = VehicleValuationsService;
exports.VehicleValuationsService = VehicleValuationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('VehicleValuation')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], VehicleValuationsService);
//# sourceMappingURL=vehicle-valuations.service.js.map
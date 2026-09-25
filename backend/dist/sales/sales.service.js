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
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let SalesService = class SalesService {
    saleModel;
    constructor(saleModel) {
        this.saleModel = saleModel;
    }
    async create(createSaleDto) {
        const createdSale = new this.saleModel(createSaleDto);
        return createdSale.save();
    }
    async findAll() {
        return this.saleModel.find().populate('customer').populate('vehicle').sort({ createdAt: -1 }).exec();
    }
    async findOne(id) {
        const sale = await this.saleModel.findById(id).populate('customer').populate('vehicle').exec();
        if (!sale) {
            throw new common_1.NotFoundException(`Sale #${id} not found`);
        }
        return sale;
    }
    async update(id, updateSaleDto) {
        const existingSale = await this.saleModel.findByIdAndUpdate(id, updateSaleDto, { new: true }).exec();
        if (!existingSale) {
            throw new common_1.NotFoundException(`Sale #${id} not found`);
        }
        return existingSale;
    }
    async remove(id) {
        const deletedSale = await this.saleModel.findByIdAndDelete(id).exec();
        if (!deletedSale) {
            throw new common_1.NotFoundException(`Sale #${id} not found`);
        }
        return deletedSale;
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Sale')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SalesService);
//# sourceMappingURL=sales.service.js.map
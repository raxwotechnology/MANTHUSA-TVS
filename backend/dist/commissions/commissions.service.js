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
exports.CommissionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let CommissionsService = class CommissionsService {
    model;
    sales;
    constructor(model, sales) {
        this.model = model;
        this.sales = sales;
    }
    async create(input) {
        if (!input.salesperson || !input.sale || !input.commissionType)
            throw new common_1.BadRequestException('Salesperson, sale and commission type are required.');
        const sale = await this.sales.findById(input.sale).exec();
        if (!sale)
            throw new common_1.NotFoundException('Sale not found.');
        const percentage = Number(input.commissionPercentage || 0);
        const amount = input.commissionType === 'Percentage' ? Number(sale.finalAmount || 0) * percentage / 100 : Number(input.commissionAmount || 0);
        if (amount < 0 || (input.commissionType === 'Percentage' && (percentage <= 0 || percentage > 100)))
            throw new common_1.BadRequestException('Commission amount or percentage is invalid.');
        return new this.model({ ...input, commissionAmount: amount }).save();
    }
    findAll() { return this.model.find().populate('salesperson', 'name email').populate('sale').sort({ createdAt: -1 }).exec(); }
    async update(id, input) {
        const item = await this.model.findByIdAndUpdate(id, input, { new: true, runValidators: true }).exec();
        if (!item)
            throw new common_1.NotFoundException(`Commission ${id} not found.`);
        return item;
    }
    async remove(id) {
        const item = await this.model.findByIdAndDelete(id).exec();
        if (!item)
            throw new common_1.NotFoundException(`Commission ${id} not found.`);
        return item;
    }
};
exports.CommissionsService = CommissionsService;
exports.CommissionsService = CommissionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Commission')),
    __param(1, (0, mongoose_1.InjectModel)('Sale')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], CommissionsService);
//# sourceMappingURL=commissions.service.js.map
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
exports.SalesTargetsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let SalesTargetsService = class SalesTargetsService {
    model;
    sales;
    constructor(model, sales) {
        this.model = model;
        this.sales = sales;
    }
    async create(input) {
        if (!input.salesperson || !/^\d{4}-\d{2}$/.test(input.month || '') || Number(input.vehicleTarget) < 0 || Number(input.revenueTarget) < 0) {
            throw new common_1.BadRequestException('Salesperson, month (YYYY-MM), and non-negative targets are required.');
        }
        const row = await this.model.findOneAndUpdate({ salesperson: input.salesperson, month: input.month }, { $set: input }, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }).exec();
        return row;
    }
    async findAll() {
        const rows = await this.model.find().populate('salesperson', 'name email').sort({ month: -1 }).exec();
        return Promise.all(rows.map(async (row) => {
            const [year, month] = row.month.split('-').map(Number);
            const from = new Date(Date.UTC(year, month - 1, 1));
            const to = new Date(Date.UTC(year, month, 1));
            const sales = await this.sales.find({ salesperson: row.salesperson?._id || row.salesperson, saleDate: { $gte: from, $lt: to }, status: { $nin: ['Cancelled', 'Refunded'] } }).select('finalAmount').exec();
            row.actualVehicles = sales.length;
            row.actualRevenue = sales.reduce((sum, sale) => sum + Number(sale.finalAmount || 0), 0);
            row.achievementPercentage = Number(row.revenueTarget) > 0 ? row.actualRevenue / Number(row.revenueTarget) * 100 : 0;
            return row;
        }));
    }
    async update(id, input) {
        const row = await this.model.findByIdAndUpdate(id, input, { new: true, runValidators: true }).exec();
        if (!row)
            throw new common_1.NotFoundException(`Sales target ${id} not found.`);
        return row;
    }
};
exports.SalesTargetsService = SalesTargetsService;
exports.SalesTargetsService = SalesTargetsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('SalesTarget')),
    __param(1, (0, mongoose_1.InjectModel)('Sale')),
    __metadata("design:paramtypes", [mongoose_2.Model, mongoose_2.Model])
], SalesTargetsService);
//# sourceMappingURL=sales-targets.service.js.map
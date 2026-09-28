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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ReportsService = class ReportsService {
    sales;
    vehicles;
    expenses;
    branches;
    leads;
    constructor(sales, vehicles, expenses, branches, leads) {
        this.sales = sales;
        this.vehicles = vehicles;
        this.expenses = expenses;
        this.branches = branches;
        this.leads = leads;
    }
    async summary(from, to) {
        const match = { status: { $nin: ['Cancelled', 'Refunded'] } };
        if (from || to) {
            match.saleDate = {};
            if (from)
                match.saleDate.$gte = new Date(from);
            if (to) {
                const end = new Date(to);
                end.setHours(23, 59, 59, 999);
                match.saleDate.$lte = end;
            }
        }
        const [saleRows, stockRows, expenseRows, soldSales] = await Promise.all([
            this.sales.aggregate([{ $match: match }, { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: '$finalAmount' }, collected: { $sum: '$paidAmount' }, outstanding: { $sum: '$balance' } } }]).exec(),
            this.vehicles.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]).exec(),
            this.expenses.aggregate([{ $match: from || to ? { expenseDate: { ...(from ? { $gte: new Date(from) } : {}), ...(to ? { $lte: new Date(to) } : {}) } } : {} }, { $group: { _id: null, total: { $sum: '$amount' } } }]).exec(),
            this.sales.find(match).populate('vehicle').exec(),
        ]);
        const sales = saleRows[0] || { count: 0, revenue: 0, collected: 0, outstanding: 0 };
        const inventory = Object.fromEntries(stockRows.map((row) => [row._id, row.count]));
        const expenses = expenseRows[0]?.total || 0;
        const costOfGoods = soldSales.reduce((sum, sale) => sum + Number(sale.vehicle?.totalInvestment || sale.vehicle?.purchasePrice || 0), 0);
        const grossProfit = Number(sales.revenue || 0) - costOfGoods;
        return { salesCount: sales.count, revenue: sales.revenue, paymentsCollected: sales.collected, outstanding: sales.outstanding, expenses, costOfGoods, grossProfit, netAfterExpenses: grossProfit - expenses, inventory };
    }
    async agingStock() {
        const rows = await this.vehicles.find({ status: { $nin: ['Sold', 'Inactive'] } }).select('stockNumber make model year registrationNumber status sellingPrice createdAt').sort({ createdAt: 1 }).lean().exec();
        const now = Date.now();
        return rows.map((vehicle) => {
            const daysInStock = Math.max(0, Math.floor((now - new Date(vehicle.createdAt || now).getTime()) / 86400000));
            const ageBand = daysInStock <= 30 ? '0-30' : daysInStock <= 60 ? '31-60' : daysInStock <= 90 ? '61-90' : '90+';
            return { ...vehicle, daysInStock, ageBand };
        });
    }
    async profitLoss(from, to) {
        const summary = await this.summary(from, to);
        return { revenue: summary.revenue, costOfGoods: summary.costOfGoods, grossProfit: summary.grossProfit, operatingExpenses: summary.expenses, netProfit: summary.netAfterExpenses };
    }
    async salesByMonth(year = new Date().getFullYear()) {
        return this.sales.aggregate([
            { $match: { saleDate: { $gte: new Date(year, 0, 1), $lt: new Date(year + 1, 0, 1) }, status: { $nin: ['Cancelled', 'Refunded'] } } },
            { $group: { _id: { $month: '$saleDate' }, count: { $sum: 1 }, revenue: { $sum: '$finalAmount' } } },
            { $sort: { _id: 1 } },
        ]).exec();
    }
    async byBranch(from, to) {
        const dates = {};
        if (from)
            dates.$gte = new Date(from);
        if (to) {
            const end = new Date(to);
            end.setHours(23, 59, 59, 999);
            dates.$lte = end;
        }
        const saleMatch = { status: { $nin: ['Cancelled', 'Refunded'] } };
        if (Object.keys(dates).length)
            saleMatch.saleDate = dates;
        const [sales, expenses, branches] = await Promise.all([
            this.sales.aggregate([
                { $match: saleMatch },
                { $lookup: { from: this.vehicles.collection.name, localField: 'vehicle', foreignField: '_id', as: 'vehicleRow' } },
                { $unwind: { path: '$vehicleRow', preserveNullAndEmptyArrays: true } },
                { $addFields: { reportBranch: { $ifNull: ['$branch', { $ifNull: ['$vehicleRow.branch', '$vehicleRow.location'] }] }, vehicleCost: { $ifNull: ['$vehicleRow.totalInvestment', { $ifNull: ['$vehicleRow.purchasePrice', 0] }] } } },
                { $group: { _id: '$reportBranch', salesCount: { $sum: 1 }, revenue: { $sum: '$finalAmount' }, costOfGoods: { $sum: '$vehicleCost' } } },
            ]).exec(),
            this.expenses.aggregate([{ $match: Object.keys(dates).length ? { expenseDate: dates } : {} }, { $group: { _id: '$branch', expenses: { $sum: '$amount' } } }]).exec(),
            this.branches.find({}).select('name location').lean().exec(),
        ]);
        const branchKey = (id) => id?.toString() || 'unassigned';
        const ids = new Set([...sales, ...expenses].map(row => branchKey(row._id)));
        return [...ids].map(id => {
            const sale = sales.find(row => branchKey(row._id) === id), expense = expenses.find(row => branchKey(row._id) === id);
            const branch = id === 'unassigned' ? undefined : branches.find(row => row._id.toString() === id);
            const revenue = Number(sale?.revenue || 0), costOfGoods = Number(sale?.costOfGoods || 0), operatingExpenses = Number(expense?.expenses || 0);
            return { branchId: id === 'unassigned' ? null : id, branchName: branch?.name || 'Unassigned', salesCount: sale?.salesCount || 0, revenue, costOfGoods, grossProfit: revenue - costOfGoods, operatingExpenses, netProfit: revenue - costOfGoods - operatingExpenses };
        }).sort((a, b) => b.revenue - a.revenue);
    }
    async salesByCategory(year = new Date().getFullYear()) {
        return this.sales.aggregate([
            { $match: { saleDate: { $gte: new Date(year, 0, 1), $lt: new Date(year + 1, 0, 1) }, status: { $nin: ['Cancelled', 'Refunded'] } } },
            { $lookup: { from: this.vehicles.collection.name, localField: 'vehicle', foreignField: '_id', as: 'vehicleRow' } },
            { $unwind: { path: '$vehicleRow', preserveNullAndEmptyArrays: true } },
            { $group: { _id: { $ifNull: ['$vehicleRow.vehicleType', 'Unspecified'] }, salesCount: { $sum: 1 }, revenue: { $sum: '$finalAmount' } } },
            { $sort: { revenue: -1 } },
        ]).exec();
    }
    async leadConversion() {
        const rows = await this.leads.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }, { $sort: { count: -1 } }]).exec();
        const total = rows.reduce((sum, row) => sum + row.count, 0);
        const won = rows.filter(row => ['Won', 'Reserved', 'Sold', 'Completed'].includes(row._id)).reduce((sum, row) => sum + row.count, 0);
        return { total, converted: won, conversionRate: total ? Math.round((won / total) * 10000) / 100 : 0, statuses: rows };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Sale')),
    __param(1, (0, mongoose_1.InjectModel)('Vehicle')),
    __param(2, (0, mongoose_1.InjectModel)('Expense')),
    __param(3, (0, mongoose_1.InjectModel)('Branch')),
    __param(4, (0, mongoose_1.InjectModel)('Lead')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ReportsService);
//# sourceMappingURL=reports.service.js.map
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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let DashboardService = class DashboardService {
    vehicleModel;
    customerModel;
    leadModel;
    saleModel;
    expenseModel;
    supplierModel;
    cashTxModel;
    constructor(vehicleModel, customerModel, leadModel, saleModel, expenseModel, supplierModel, cashTxModel) {
        this.vehicleModel = vehicleModel;
        this.customerModel = customerModel;
        this.leadModel = leadModel;
        this.saleModel = saleModel;
        this.expenseModel = expenseModel;
        this.supplierModel = supplierModel;
        this.cashTxModel = cashTxModel;
    }
    async getDashboardStats() {
        const totalVehicles = await this.vehicleModel.countDocuments();
        const availableVehicles = await this.vehicleModel.countDocuments({ status: 'Available' });
        const reservedVehicles = await this.vehicleModel.countDocuments({ status: 'Reserved' });
        const soldVehicles = await this.vehicleModel.countDocuments({ status: 'Sold' });
        const totalCustomers = await this.customerModel.countDocuments();
        const newLeads = await this.leadModel.countDocuments({ status: 'New' });
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const validSale = { status: { $nin: ['Cancelled', 'Refunded'] } };
        const todaySalesDocs = await this.saleModel.find({ ...validSale, saleDate: { $gte: startOfToday } });
        const todaySales = todaySalesDocs.length;
        const monthlySalesDocs = await this.saleModel.find({ ...validSale, saleDate: { $gte: startOfMonth } });
        const monthlySales = monthlySalesDocs.length;
        const monthlyRevenue = monthlySalesDocs.reduce((sum, s) => sum + (s.finalAmount || 0), 0);
        const allSales = await this.saleModel.find(validSale);
        const outstandingCustomerPayments = allSales.reduce((sum, s) => sum + ((s.finalAmount || 0) - (s.paidAmount || 0)), 0);
        const suppliers = await this.supplierModel.find();
        const supplierOutstanding = suppliers.reduce((sum, sup) => sum + (sup.outstandingBalance || 0), 0);
        const expenses = await this.expenseModel.find();
        const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
        const soldVehicleDocs = await this.vehicleModel.find({ status: 'Sold' });
        const grossProfit = soldVehicleDocs.reduce((sum, v) => sum + ((v.sellingPrice || 0) - (v.totalInvestment || v.purchasePrice || 0)), 0);
        const netProfit = grossProfit - totalExpenses;
        const cashTxs = await this.cashTxModel.find();
        let cashBalance = 0;
        cashTxs.forEach(tx => {
            if (tx.transactionType === 'IN')
                cashBalance += (tx.amount || 0);
            else if (tx.transactionType === 'OUT')
                cashBalance -= (tx.amount || 0);
        });
        return {
            totalVehicles,
            availableVehicles,
            reservedVehicles,
            soldVehicles,
            totalCustomers,
            newLeads,
            todaySales,
            monthlySales,
            monthlyRevenue,
            outstandingCustomerPayments,
            supplierOutstanding,
            totalExpenses,
            grossProfit,
            netProfit,
            cashBalance
        };
    }
    async getCustomerStats(userId, email) {
        try {
            const availableVehicles = await this.vehicleModel.countDocuments({ status: 'Available' });
            let myReservations = 0;
            let myInquiries = 0;
            let customerDoc = null;
            if (email) {
                customerDoc = await this.customerModel.findOne({ email: email.toLowerCase() });
            }
            if (!customerDoc && userId && mongoose_2.Types.ObjectId.isValid(userId)) {
                customerDoc = await this.customerModel.findById(userId);
            }
            if (customerDoc) {
                myReservations = await this.leadModel.countDocuments({ customer: customerDoc._id, status: 'Reserved' });
                myInquiries = await this.leadModel.countDocuments({ customer: customerDoc._id });
            }
            return {
                totalVehicles: availableVehicles,
                availableVehicles,
                myReservations,
                myInquiries,
                isCustomerPortal: true
            };
        }
        catch {
            return {
                totalVehicles: 0,
                availableVehicles: 0,
                myReservations: 0,
                myInquiries: 0,
                isCustomerPortal: true
            };
        }
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Vehicle')),
    __param(1, (0, mongoose_1.InjectModel)('Customer')),
    __param(2, (0, mongoose_1.InjectModel)('Lead')),
    __param(3, (0, mongoose_1.InjectModel)('Sale')),
    __param(4, (0, mongoose_1.InjectModel)('Expense')),
    __param(5, (0, mongoose_1.InjectModel)('Supplier')),
    __param(6, (0, mongoose_1.InjectModel)('CashTransaction')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map
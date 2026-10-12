import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel('Vehicle') private vehicleModel: Model<any>,
    @InjectModel('Customer') private customerModel: Model<any>,
    @InjectModel('Lead') private leadModel: Model<any>,
    @InjectModel('Sale') private saleModel: Model<any>,
    @InjectModel('Expense') private expenseModel: Model<any>,
    @InjectModel('Supplier') private supplierModel: Model<any>,
    @InjectModel('CashTransaction') private cashTxModel: Model<any>
  ) {}

  async getDashboardStats() {
    const totalVehicles = await this.vehicleModel.countDocuments();
    const availableVehicles = await this.vehicleModel.countDocuments({
      status: { $in: [/^available$/i, /^purchased$/i, /^in stock$/i] }
    });
    const reservedVehicles = await this.vehicleModel.countDocuments({ status: /^reserved$/i });
    const soldVehicles = await this.vehicleModel.countDocuments({ status: /^sold$/i });
    const totalCustomers = await this.customerModel.countDocuments();
    const newLeads = await this.leadModel.countDocuments({ status: 'New' });

    // Sales calculation
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

    // Outstanding customer payments
    const allSales = await this.saleModel.find(validSale);
    const outstandingCustomerPayments = allSales.reduce((sum, s) => sum + ((s.finalAmount || 0) - (s.paidAmount || 0)), 0);

    // Supplier outstanding
    const suppliers = await this.supplierModel.find();
    const supplierOutstanding = suppliers.reduce((sum, sup) => sum + (sup.outstandingBalance || 0), 0);

    // Total expenses
    const expenses = await this.expenseModel.find();
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

    // Gross profit (Vehicle selling price - total investment for sold vehicles)
    const soldVehicleDocs = await this.vehicleModel.find({ status: 'Sold' });
    const grossProfit = soldVehicleDocs.reduce((sum, v) => sum + ((v.sellingPrice || 0) - (v.totalInvestment || v.purchasePrice || 0)), 0);

    // Net profit = Gross profit - Total expenses
    const netProfit = grossProfit - totalExpenses;

    // Cash transactions for balance
    const cashTxs = await this.cashTxModel.find();
    let cashBalance = 0;
    cashTxs.forEach(tx => {
      if (tx.transactionType === 'IN') cashBalance += (tx.amount || 0);
      else if (tx.transactionType === 'OUT') cashBalance -= (tx.amount || 0);
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

  async getCustomerStats(userId?: string, email?: string) {
    try {
      const availableVehicles = await this.vehicleModel.countDocuments({
        status: { $in: [/^available$/i, /^purchased$/i, /^in stock$/i] }
      });
      let myReservations = 0;
      let myInquiries = 0;

      let customerDoc: any = null;
      if (email) {
        customerDoc = await this.customerModel.findOne({ email: email.toLowerCase() });
      }
      if (!customerDoc && userId && Types.ObjectId.isValid(userId)) {
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
    } catch {
      return {
        totalVehicles: 0,
        availableVehicles: 0,
        myReservations: 0,
        myInquiries: 0,
        isCustomerPortal: true
      };
    }
  }
}

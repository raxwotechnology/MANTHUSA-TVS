import { Model } from 'mongoose';
export declare class DashboardService {
    private vehicleModel;
    private customerModel;
    private leadModel;
    private saleModel;
    private expenseModel;
    private supplierModel;
    private cashTxModel;
    constructor(vehicleModel: Model<any>, customerModel: Model<any>, leadModel: Model<any>, saleModel: Model<any>, expenseModel: Model<any>, supplierModel: Model<any>, cashTxModel: Model<any>);
    getDashboardStats(): Promise<{
        totalVehicles: number;
        availableVehicles: number;
        reservedVehicles: number;
        soldVehicles: number;
        totalCustomers: number;
        newLeads: number;
        todaySales: number;
        monthlySales: number;
        monthlyRevenue: any;
        outstandingCustomerPayments: any;
        supplierOutstanding: any;
        totalExpenses: any;
        grossProfit: any;
        netProfit: number;
        cashBalance: number;
    }>;
}

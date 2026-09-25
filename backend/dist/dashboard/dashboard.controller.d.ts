import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(): Promise<{
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

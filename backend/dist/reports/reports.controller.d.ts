import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reports;
    constructor(reports: ReportsService);
    summary(from?: string, to?: string): Promise<{
        salesCount: any;
        revenue: any;
        paymentsCollected: any;
        outstanding: any;
        expenses: any;
        costOfGoods: any;
        grossProfit: number;
        netAfterExpenses: number;
        inventory: any;
    }>;
    salesByMonth(year?: string): Promise<any[]>;
    agingStock(): Promise<any[]>;
    profitLoss(from?: string, to?: string): Promise<{
        revenue: any;
        costOfGoods: any;
        grossProfit: number;
        operatingExpenses: any;
        netProfit: number;
    }>;
    byBranch(from?: string, to?: string): Promise<{
        branchId: any;
        branchName: any;
        salesCount: any;
        revenue: number;
        costOfGoods: number;
        grossProfit: number;
        operatingExpenses: number;
        netProfit: number;
    }[]>;
    salesByCategory(year?: string): Promise<any[]>;
    leadConversion(): Promise<{
        total: any;
        converted: any;
        conversionRate: number;
        statuses: any[];
    }>;
}

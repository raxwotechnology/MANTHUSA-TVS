import { Model } from 'mongoose';
export declare class ReportsService {
    private readonly sales;
    private readonly vehicles;
    private readonly expenses;
    private readonly branches;
    private readonly leads;
    constructor(sales: Model<any>, vehicles: Model<any>, expenses: Model<any>, branches: Model<any>, leads: Model<any>);
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
    agingStock(): Promise<any[]>;
    profitLoss(from?: string, to?: string): Promise<{
        revenue: any;
        costOfGoods: any;
        grossProfit: number;
        operatingExpenses: any;
        netProfit: number;
    }>;
    salesByMonth(year?: number): Promise<any[]>;
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
    salesByCategory(year?: number): Promise<any[]>;
    leadConversion(): Promise<{
        total: any;
        converted: any;
        conversionRate: number;
        statuses: any[];
    }>;
    accountingExport(format?: string): Promise<{
        format: string;
        filename: string;
        content: string;
    }>;
}

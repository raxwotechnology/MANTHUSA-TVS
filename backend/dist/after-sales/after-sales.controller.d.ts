import { AfterSalesService } from './after-sales.service';
export declare class AfterSalesController {
    private readonly afterSales;
    constructor(afterSales: AfterSalesService);
    create(body: any): any;
    findAll(): Promise<any[]>;
    update(id: string, body: any): Promise<any>;
}

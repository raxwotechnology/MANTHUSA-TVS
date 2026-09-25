import { SalesService } from './sales.service';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    create(createSaleDto: any): Promise<import("./schemas/sale.schema").SaleDocument>;
    findAll(): Promise<import("./schemas/sale.schema").SaleDocument[]>;
    findOne(id: string): Promise<import("./schemas/sale.schema").SaleDocument>;
    update(id: string, updateSaleDto: any): Promise<import("./schemas/sale.schema").SaleDocument>;
    remove(id: string): Promise<any>;
}

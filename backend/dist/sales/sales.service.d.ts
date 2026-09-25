import { Model } from 'mongoose';
import { SaleDocument } from './schemas/sale.schema';
export declare class SalesService {
    private saleModel;
    constructor(saleModel: Model<SaleDocument>);
    create(createSaleDto: any): Promise<SaleDocument>;
    findAll(): Promise<SaleDocument[]>;
    findOne(id: string): Promise<SaleDocument>;
    update(id: string, updateSaleDto: any): Promise<SaleDocument>;
    remove(id: string): Promise<any>;
}

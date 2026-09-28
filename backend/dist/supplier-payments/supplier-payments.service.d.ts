import { Model } from 'mongoose';
export declare class SupplierPaymentsService {
    private readonly payments;
    private readonly suppliers;
    private readonly cash;
    constructor(payments: Model<any>, suppliers: Model<any>, cash: Model<any>);
    create(input: any): Promise<any>;
    findAll(): Promise<any[]>;
}

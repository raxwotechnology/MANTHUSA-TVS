import { Model } from 'mongoose';
export declare class RefundsService {
    private readonly refunds;
    private readonly sales;
    private readonly reservations;
    private readonly cash;
    constructor(refunds: Model<any>, sales: Model<any>, reservations: Model<any>, cash: Model<any>);
    create(input: any): Promise<any>;
    findAll(): Promise<any[]>;
}

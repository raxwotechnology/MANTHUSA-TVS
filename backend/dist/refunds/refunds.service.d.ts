import { Model } from 'mongoose';
export declare class RefundsService {
    private readonly refunds;
    private readonly sales;
    private readonly reservations;
    private readonly cash;
    private readonly vehicles;
    constructor(refunds: Model<any>, sales: Model<any>, reservations: Model<any>, cash: Model<any>, vehicles: Model<any>);
    create(input: any): Promise<any>;
    findAll(): Promise<any[]>;
}

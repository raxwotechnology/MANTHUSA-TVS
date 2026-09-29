import { Model } from 'mongoose';
export declare class AfterSalesService {
    private readonly model;
    constructor(model: Model<any>);
    create(input: any): any;
    findAll(): Promise<any[]>;
    update(id: string, input: any): Promise<any>;
    remove(id: string): Promise<any>;
}

import { Model } from 'mongoose';
export declare class CommissionsService {
    private readonly model;
    private readonly sales;
    constructor(model: Model<any>, sales: Model<any>);
    create(input: any): Promise<any>;
    findAll(): Promise<any[]>;
    update(id: string, input: any): Promise<any>;
    remove(id: string): Promise<any>;
}

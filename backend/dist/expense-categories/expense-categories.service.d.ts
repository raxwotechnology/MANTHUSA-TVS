import { Model } from 'mongoose';
export declare class ExpenseCategoriesService {
    private readonly model;
    constructor(model: Model<any>);
    create(input: any): Promise<any>;
    findAll(): Promise<any[]>;
    remove(id: string): Promise<any>;
}

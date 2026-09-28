import { Model } from 'mongoose';
export declare class ComplaintsService {
    private readonly model;
    constructor(model: Model<any>);
    create(input: any): any;
    findAll(): Promise<any[]>;
    update(id: string, input: any): Promise<any>;
}

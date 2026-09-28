import { Model } from 'mongoose';
export declare class DiscountRequestsService {
    private readonly requests;
    private readonly quotations;
    private readonly vehicles;
    constructor(requests: Model<any>, quotations: Model<any>, vehicles: Model<any>);
    create(input: any, userId: string): Promise<any>;
    findAll(): Promise<any[]>;
    decide(id: string, input: any, approverId: string, role: string): Promise<any>;
}

import { Model } from 'mongoose';
export declare class LeadActivitiesService {
    private readonly model;
    constructor(model: Model<any>);
    create(input: any): any;
    findAll(lead?: string): Promise<any[]>;
}

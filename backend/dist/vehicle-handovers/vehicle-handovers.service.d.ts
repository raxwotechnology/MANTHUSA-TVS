import { Model } from 'mongoose';
export declare class VehicleHandoversService {
    private readonly handovers;
    private readonly sales;
    constructor(handovers: Model<any>, sales: Model<any>);
    create(input: any): Promise<any>;
    findAll(): Promise<any[]>;
    update(id: string, input: any): Promise<any>;
}

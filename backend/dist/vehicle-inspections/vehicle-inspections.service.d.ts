import { Model } from 'mongoose';
export declare class VehicleInspectionsService {
    private readonly inspections;
    private readonly vehicles;
    constructor(inspections: Model<any>, vehicles: Model<any>);
    create(input: any): Promise<any>;
    findAll(): Promise<any[]>;
    update(id: string, input: any): Promise<any>;
}

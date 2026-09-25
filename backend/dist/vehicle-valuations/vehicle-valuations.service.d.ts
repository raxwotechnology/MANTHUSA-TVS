import { Model } from 'mongoose';
import { VehicleValuationDocument } from './schemas/vehicle-valuation.schema';
export declare class VehicleValuationsService {
    private valuationModel;
    constructor(valuationModel: Model<VehicleValuationDocument>);
    create(createDto: any): Promise<VehicleValuationDocument>;
    findAll(): Promise<VehicleValuationDocument[]>;
    findOne(id: string): Promise<VehicleValuationDocument>;
    update(id: string, updateDto: any): Promise<VehicleValuationDocument>;
    remove(id: string): Promise<any>;
}

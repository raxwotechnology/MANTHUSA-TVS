import { Model } from 'mongoose';
import { VehicleDocument } from './schemas/vehicle.schema';
export declare class VehiclesService {
    private vehicleModel;
    constructor(vehicleModel: Model<VehicleDocument>);
    create(createVehicleDto: any): Promise<VehicleDocument>;
    findAll(): Promise<VehicleDocument[]>;
    findPublicListings(): Promise<(import("./schemas/vehicle.schema").Vehicle & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<VehicleDocument>;
    update(id: string, updateVehicleDto: any): Promise<VehicleDocument>;
    remove(id: string): Promise<any>;
}

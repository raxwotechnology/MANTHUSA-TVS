import { Model } from 'mongoose';
import { VehicleDocument } from './schemas/vehicle.schema';
export declare class VehiclesService {
    private vehicleModel;
    constructor(vehicleModel: Model<VehicleDocument>);
    create(createVehicleDto: any): Promise<VehicleDocument>;
    findAll(): Promise<VehicleDocument[]>;
    findOne(id: string): Promise<VehicleDocument>;
    update(id: string, updateVehicleDto: any): Promise<VehicleDocument>;
    remove(id: string): Promise<any>;
}

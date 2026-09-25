import { VehiclesService } from './vehicles.service';
export declare class VehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    create(createVehicleDto: any): Promise<import("./schemas/vehicle.schema").VehicleDocument>;
    findAll(): Promise<import("./schemas/vehicle.schema").VehicleDocument[]>;
    findOne(id: string): Promise<import("./schemas/vehicle.schema").VehicleDocument>;
    update(id: string, updateVehicleDto: any): Promise<import("./schemas/vehicle.schema").VehicleDocument>;
    remove(id: string): Promise<any>;
}

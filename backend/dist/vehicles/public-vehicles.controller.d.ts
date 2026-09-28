import { VehiclesService } from './vehicles.service';
export declare class PublicVehiclesController {
    private readonly vehicles;
    constructor(vehicles: VehiclesService);
    list(): Promise<(import("./schemas/vehicle.schema").Vehicle & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}

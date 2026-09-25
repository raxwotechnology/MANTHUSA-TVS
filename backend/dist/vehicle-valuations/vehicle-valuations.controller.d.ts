import { VehicleValuationsService } from './vehicle-valuations.service';
export declare class VehicleValuationsController {
    private readonly service;
    constructor(service: VehicleValuationsService);
    create(createDto: any): Promise<import("./schemas/vehicle-valuation.schema").VehicleValuationDocument>;
    findAll(): Promise<import("./schemas/vehicle-valuation.schema").VehicleValuationDocument[]>;
    findOne(id: string): Promise<import("./schemas/vehicle-valuation.schema").VehicleValuationDocument>;
    update(id: string, updateDto: any): Promise<import("./schemas/vehicle-valuation.schema").VehicleValuationDocument>;
    remove(id: string): Promise<any>;
}

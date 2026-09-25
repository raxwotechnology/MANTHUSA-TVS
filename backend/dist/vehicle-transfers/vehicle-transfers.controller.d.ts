import { VehicleTransfersService } from './vehicle-transfers.service';
export declare class VehicleTransfersController {
    private readonly service;
    constructor(service: VehicleTransfersService);
    create(createDto: any): Promise<import("./schemas/vehicle-transfer.schema").VehicleTransferDocument>;
    findAll(): Promise<import("./schemas/vehicle-transfer.schema").VehicleTransferDocument[]>;
    findOne(id: string): Promise<import("./schemas/vehicle-transfer.schema").VehicleTransferDocument>;
    update(id: string, updateDto: any): Promise<import("./schemas/vehicle-transfer.schema").VehicleTransferDocument>;
    remove(id: string): Promise<any>;
}

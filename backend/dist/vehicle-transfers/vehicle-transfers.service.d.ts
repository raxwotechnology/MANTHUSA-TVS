import { Model } from 'mongoose';
import { VehicleTransferDocument } from './schemas/vehicle-transfer.schema';
export declare class VehicleTransfersService {
    private transferModel;
    constructor(transferModel: Model<VehicleTransferDocument>);
    create(createDto: any): Promise<VehicleTransferDocument>;
    findAll(): Promise<VehicleTransferDocument[]>;
    findOne(id: string): Promise<VehicleTransferDocument>;
    update(id: string, updateDto: any): Promise<VehicleTransferDocument>;
    remove(id: string): Promise<any>;
}

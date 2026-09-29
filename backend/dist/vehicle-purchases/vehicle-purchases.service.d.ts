import { Model } from 'mongoose';
import { VehiclePurchaseDocument } from './schemas/vehicle-purchase.schema';
export declare class VehiclePurchasesService {
    private readonly purchaseModel;
    private readonly vehicleModel;
    private readonly supplierModel;
    private readonly cashTransactions;
    constructor(purchaseModel: Model<VehiclePurchaseDocument>, vehicleModel: Model<any>, supplierModel: Model<any>, cashTransactions: Model<any>);
    create(input: any): Promise<import("mongoose").Document<unknown, {}, VehiclePurchaseDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/vehicle-purchase.schema").VehiclePurchase & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, VehiclePurchaseDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/vehicle-purchase.schema").VehiclePurchase & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, VehiclePurchaseDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/vehicle-purchase.schema").VehiclePurchase & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, input: any): Promise<import("mongoose").Document<unknown, {}, VehiclePurchaseDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/vehicle-purchase.schema").VehiclePurchase & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(id: string): Promise<import("mongoose").Document<unknown, {}, VehiclePurchaseDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/vehicle-purchase.schema").VehiclePurchase & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}

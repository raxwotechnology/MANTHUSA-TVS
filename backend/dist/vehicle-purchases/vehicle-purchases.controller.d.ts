import { VehiclePurchasesService } from './vehicle-purchases.service';
export declare class VehiclePurchasesController {
    private readonly purchases;
    constructor(purchases: VehiclePurchasesService);
    create(body: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/vehicle-purchase.schema").VehiclePurchaseDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/vehicle-purchase.schema").VehiclePurchase & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/vehicle-purchase.schema").VehiclePurchaseDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/vehicle-purchase.schema").VehiclePurchase & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/vehicle-purchase.schema").VehiclePurchaseDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/vehicle-purchase.schema").VehiclePurchase & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}

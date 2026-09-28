import { Model } from 'mongoose';
import { StockMovementDocument } from './schemas/stock-movement.schema';
export declare class StockMovementsService {
    private stockMovementModel;
    constructor(stockMovementModel: Model<StockMovementDocument>);
    create(dto: any): Promise<import("mongoose").Document<unknown, {}, StockMovementDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/stock-movement.schema").StockMovement & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findByVehicle(vehicleId: string): Promise<(import("mongoose").Document<unknown, {}, StockMovementDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/stock-movement.schema").StockMovement & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, StockMovementDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/stock-movement.schema").StockMovement & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}

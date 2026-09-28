import { StockMovementsService } from './stock-movements.service';
export declare class StockMovementsController {
    private readonly stockMovementsService;
    constructor(stockMovementsService: StockMovementsService);
    create(dto: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/stock-movement.schema").StockMovementDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/stock-movement.schema").StockMovement & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/stock-movement.schema").StockMovementDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/stock-movement.schema").StockMovement & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findByVehicle(vehicleId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/stock-movement.schema").StockMovementDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/stock-movement.schema").StockMovement & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}

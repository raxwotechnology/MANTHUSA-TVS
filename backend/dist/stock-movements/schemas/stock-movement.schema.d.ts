import { Document, Types, Schema as MongooseSchema } from 'mongoose';
export type StockMovementDocument = StockMovement & Document;
export declare class StockMovement {
    vehicle: Types.ObjectId;
    action: string;
    fromBranch: Types.ObjectId;
    toBranch: Types.ObjectId;
    previousStatus: string;
    newStatus: string;
    notes: string;
    updatedBy: Types.ObjectId;
}
export declare const StockMovementSchema: MongooseSchema<StockMovement, import("mongoose").Model<StockMovement, any, any, any, any, any, StockMovement>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, StockMovement, Document<unknown, {}, StockMovement, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<StockMovement & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    vehicle?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, StockMovement, Document<unknown, {}, StockMovement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockMovement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    action?: import("mongoose").SchemaDefinitionProperty<string, StockMovement, Document<unknown, {}, StockMovement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockMovement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    fromBranch?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, StockMovement, Document<unknown, {}, StockMovement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockMovement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    toBranch?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, StockMovement, Document<unknown, {}, StockMovement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockMovement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    previousStatus?: import("mongoose").SchemaDefinitionProperty<string, StockMovement, Document<unknown, {}, StockMovement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockMovement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    newStatus?: import("mongoose").SchemaDefinitionProperty<string, StockMovement, Document<unknown, {}, StockMovement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockMovement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    notes?: import("mongoose").SchemaDefinitionProperty<string, StockMovement, Document<unknown, {}, StockMovement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockMovement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    updatedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, StockMovement, Document<unknown, {}, StockMovement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockMovement & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, StockMovement>;

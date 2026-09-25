import { Document, Types } from 'mongoose';
export type SalesTargetDocument = SalesTarget & Document;
export declare class SalesTarget {
    salesperson: Types.ObjectId;
    month: string;
    vehicleTarget: number;
    revenueTarget: number;
    actualVehicles: number;
    actualRevenue: number;
    achievementPercentage: number;
}
export declare const SalesTargetSchema: import("mongoose").Schema<SalesTarget, import("mongoose").Model<SalesTarget, any, any, any, any, any, SalesTarget>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SalesTarget, Document<unknown, {}, SalesTarget, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<SalesTarget & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    salesperson?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, SalesTarget, Document<unknown, {}, SalesTarget, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SalesTarget & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    month?: import("mongoose").SchemaDefinitionProperty<string, SalesTarget, Document<unknown, {}, SalesTarget, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SalesTarget & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    vehicleTarget?: import("mongoose").SchemaDefinitionProperty<number, SalesTarget, Document<unknown, {}, SalesTarget, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SalesTarget & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    revenueTarget?: import("mongoose").SchemaDefinitionProperty<number, SalesTarget, Document<unknown, {}, SalesTarget, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SalesTarget & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    actualVehicles?: import("mongoose").SchemaDefinitionProperty<number, SalesTarget, Document<unknown, {}, SalesTarget, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SalesTarget & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    actualRevenue?: import("mongoose").SchemaDefinitionProperty<number, SalesTarget, Document<unknown, {}, SalesTarget, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SalesTarget & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    achievementPercentage?: import("mongoose").SchemaDefinitionProperty<number, SalesTarget, Document<unknown, {}, SalesTarget, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SalesTarget & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, SalesTarget>;

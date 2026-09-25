import { Document, Types } from 'mongoose';
export type VehicleInspectionDocument = VehicleInspection & Document;
export declare class VehicleInspection {
    vehicle: Types.ObjectId;
    inspector: Types.ObjectId;
    checklist: any;
    result: string;
    notes: string;
    estimatedRepairCost: number;
    images: string[];
}
export declare const VehicleInspectionSchema: import("mongoose").Schema<VehicleInspection, import("mongoose").Model<VehicleInspection, any, any, any, any, any, VehicleInspection>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, VehicleInspection, Document<unknown, {}, VehicleInspection, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<VehicleInspection & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    vehicle?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, VehicleInspection, Document<unknown, {}, VehicleInspection, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleInspection & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    inspector?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, VehicleInspection, Document<unknown, {}, VehicleInspection, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleInspection & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    checklist?: import("mongoose").SchemaDefinitionProperty<any, VehicleInspection, Document<unknown, {}, VehicleInspection, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleInspection & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    result?: import("mongoose").SchemaDefinitionProperty<string, VehicleInspection, Document<unknown, {}, VehicleInspection, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleInspection & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    notes?: import("mongoose").SchemaDefinitionProperty<string, VehicleInspection, Document<unknown, {}, VehicleInspection, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleInspection & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    estimatedRepairCost?: import("mongoose").SchemaDefinitionProperty<number, VehicleInspection, Document<unknown, {}, VehicleInspection, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleInspection & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    images?: import("mongoose").SchemaDefinitionProperty<string[], VehicleInspection, Document<unknown, {}, VehicleInspection, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleInspection & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, VehicleInspection>;

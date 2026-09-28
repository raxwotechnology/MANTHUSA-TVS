import { Document, Types, Schema as MongooseSchema } from 'mongoose';
export type VehicleMediaDocument = VehicleMedia & Document;
export declare class VehicleMedia {
    vehicle: Types.ObjectId;
    mediaType: string;
    category: string;
    url: string;
}
export declare const VehicleMediaSchema: MongooseSchema<VehicleMedia, import("mongoose").Model<VehicleMedia, any, any, any, any, any, VehicleMedia>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, VehicleMedia, Document<unknown, {}, VehicleMedia, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<VehicleMedia & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    vehicle?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, VehicleMedia, Document<unknown, {}, VehicleMedia, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleMedia & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    mediaType?: import("mongoose").SchemaDefinitionProperty<string, VehicleMedia, Document<unknown, {}, VehicleMedia, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleMedia & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    category?: import("mongoose").SchemaDefinitionProperty<string, VehicleMedia, Document<unknown, {}, VehicleMedia, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleMedia & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    url?: import("mongoose").SchemaDefinitionProperty<string, VehicleMedia, Document<unknown, {}, VehicleMedia, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleMedia & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, VehicleMedia>;

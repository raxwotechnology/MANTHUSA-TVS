import { Document, Types } from 'mongoose';
export type VehicleFeatureDocument = VehicleFeature & Document;
export declare class VehicleFeature {
    vehicle: Types.ObjectId;
    category: string;
    featureName: string;
    featureValue: string;
}
export declare const VehicleFeatureSchema: import("mongoose").Schema<VehicleFeature, import("mongoose").Model<VehicleFeature, any, any, any, any, any, VehicleFeature>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, VehicleFeature, Document<unknown, {}, VehicleFeature, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<VehicleFeature & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    vehicle?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, VehicleFeature, Document<unknown, {}, VehicleFeature, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleFeature & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    category?: import("mongoose").SchemaDefinitionProperty<string, VehicleFeature, Document<unknown, {}, VehicleFeature, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleFeature & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    featureName?: import("mongoose").SchemaDefinitionProperty<string, VehicleFeature, Document<unknown, {}, VehicleFeature, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleFeature & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    featureValue?: import("mongoose").SchemaDefinitionProperty<string, VehicleFeature, Document<unknown, {}, VehicleFeature, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleFeature & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, VehicleFeature>;

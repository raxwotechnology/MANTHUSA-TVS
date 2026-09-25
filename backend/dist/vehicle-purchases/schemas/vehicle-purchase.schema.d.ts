import { Document, Types } from 'mongoose';
export type VehiclePurchaseDocument = VehiclePurchase & Document;
export declare class VehiclePurchase {
    vehicle: Types.ObjectId;
    supplier: Types.ObjectId;
    purchaseDate: Date;
    purchasePrice: number;
    additionalCosts: number;
    paymentStatus: string;
}
export declare const VehiclePurchaseSchema: import("mongoose").Schema<VehiclePurchase, import("mongoose").Model<VehiclePurchase, any, any, any, any, any, VehiclePurchase>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, VehiclePurchase, Document<unknown, {}, VehiclePurchase, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<VehiclePurchase & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    vehicle?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, VehiclePurchase, Document<unknown, {}, VehiclePurchase, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehiclePurchase & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    supplier?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, VehiclePurchase, Document<unknown, {}, VehiclePurchase, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehiclePurchase & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    purchaseDate?: import("mongoose").SchemaDefinitionProperty<Date, VehiclePurchase, Document<unknown, {}, VehiclePurchase, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehiclePurchase & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    purchasePrice?: import("mongoose").SchemaDefinitionProperty<number, VehiclePurchase, Document<unknown, {}, VehiclePurchase, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehiclePurchase & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    additionalCosts?: import("mongoose").SchemaDefinitionProperty<number, VehiclePurchase, Document<unknown, {}, VehiclePurchase, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehiclePurchase & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    paymentStatus?: import("mongoose").SchemaDefinitionProperty<string, VehiclePurchase, Document<unknown, {}, VehiclePurchase, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehiclePurchase & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, VehiclePurchase>;

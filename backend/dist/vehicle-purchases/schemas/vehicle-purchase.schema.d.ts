import { Document, Types, Schema as MongooseSchema } from 'mongoose';
export type VehiclePurchaseDocument = VehiclePurchase & Document;
export declare class VehiclePurchase {
    vehicle: Types.ObjectId;
    supplier: Types.ObjectId;
    purchaseDate: Date;
    purchasePrice: number;
    additionalCosts: number;
    paymentStatus: string;
    paidAmount: number;
    sellerNicPassport: string;
    sellerPhone: string;
    sellerAddress: string;
    sellerBankDetails: string;
}
export declare const VehiclePurchaseSchema: MongooseSchema<VehiclePurchase, import("mongoose").Model<VehiclePurchase, any, any, any, any, any, VehiclePurchase>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, VehiclePurchase, Document<unknown, {}, VehiclePurchase, {
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
    paidAmount?: import("mongoose").SchemaDefinitionProperty<number, VehiclePurchase, Document<unknown, {}, VehiclePurchase, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehiclePurchase & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    sellerNicPassport?: import("mongoose").SchemaDefinitionProperty<string, VehiclePurchase, Document<unknown, {}, VehiclePurchase, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehiclePurchase & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    sellerPhone?: import("mongoose").SchemaDefinitionProperty<string, VehiclePurchase, Document<unknown, {}, VehiclePurchase, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehiclePurchase & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    sellerAddress?: import("mongoose").SchemaDefinitionProperty<string, VehiclePurchase, Document<unknown, {}, VehiclePurchase, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehiclePurchase & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    sellerBankDetails?: import("mongoose").SchemaDefinitionProperty<string, VehiclePurchase, Document<unknown, {}, VehiclePurchase, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehiclePurchase & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, VehiclePurchase>;

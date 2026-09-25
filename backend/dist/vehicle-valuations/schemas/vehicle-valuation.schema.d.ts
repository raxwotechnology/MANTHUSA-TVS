import { Document, Types } from 'mongoose';
export type VehicleValuationDocument = VehicleValuation & Document;
export declare class VehicleValuation {
    valuationId: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    vehicleMake: string;
    vehicleModel: string;
    year: number;
    mileage: number;
    condition: string;
    askingPrice: number;
    marketValuation: number;
    repairEstimate: number;
    offeredPurchasePrice: number;
    status: string;
    images: string[];
    notes: string;
}
export declare const VehicleValuationSchema: import("mongoose").Schema<VehicleValuation, import("mongoose").Model<VehicleValuation, any, any, any, any, any, VehicleValuation>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, VehicleValuation, Document<unknown, {}, VehicleValuation, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<VehicleValuation & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    valuationId?: import("mongoose").SchemaDefinitionProperty<string, VehicleValuation, Document<unknown, {}, VehicleValuation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleValuation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    customerName?: import("mongoose").SchemaDefinitionProperty<string, VehicleValuation, Document<unknown, {}, VehicleValuation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleValuation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    customerPhone?: import("mongoose").SchemaDefinitionProperty<string, VehicleValuation, Document<unknown, {}, VehicleValuation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleValuation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    customerEmail?: import("mongoose").SchemaDefinitionProperty<string, VehicleValuation, Document<unknown, {}, VehicleValuation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleValuation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    vehicleMake?: import("mongoose").SchemaDefinitionProperty<string, VehicleValuation, Document<unknown, {}, VehicleValuation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleValuation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    vehicleModel?: import("mongoose").SchemaDefinitionProperty<string, VehicleValuation, Document<unknown, {}, VehicleValuation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleValuation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    year?: import("mongoose").SchemaDefinitionProperty<number, VehicleValuation, Document<unknown, {}, VehicleValuation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleValuation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    mileage?: import("mongoose").SchemaDefinitionProperty<number, VehicleValuation, Document<unknown, {}, VehicleValuation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleValuation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    condition?: import("mongoose").SchemaDefinitionProperty<string, VehicleValuation, Document<unknown, {}, VehicleValuation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleValuation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    askingPrice?: import("mongoose").SchemaDefinitionProperty<number, VehicleValuation, Document<unknown, {}, VehicleValuation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleValuation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    marketValuation?: import("mongoose").SchemaDefinitionProperty<number, VehicleValuation, Document<unknown, {}, VehicleValuation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleValuation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    repairEstimate?: import("mongoose").SchemaDefinitionProperty<number, VehicleValuation, Document<unknown, {}, VehicleValuation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleValuation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    offeredPurchasePrice?: import("mongoose").SchemaDefinitionProperty<number, VehicleValuation, Document<unknown, {}, VehicleValuation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleValuation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, VehicleValuation, Document<unknown, {}, VehicleValuation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleValuation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    images?: import("mongoose").SchemaDefinitionProperty<string[], VehicleValuation, Document<unknown, {}, VehicleValuation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleValuation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    notes?: import("mongoose").SchemaDefinitionProperty<string, VehicleValuation, Document<unknown, {}, VehicleValuation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleValuation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, VehicleValuation>;

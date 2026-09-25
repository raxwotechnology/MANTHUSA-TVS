import { Document, Types } from 'mongoose';
export type VehicleCostDocument = VehicleCost & Document;
export declare class VehicleCost {
    vehicle: Types.ObjectId;
    purchasePrice: number;
    importCost: number;
    transportCost: number;
    repairCost: number;
    detailingCost: number;
    registrationCost: number;
    insuranceCost: number;
    advertisementCost: number;
    otherCosts: number;
    totalInvestment: number;
    sellingPrice: number;
    minimumSellingPrice: number;
    expectedProfit: number;
}
export declare const VehicleCostSchema: import("mongoose").Schema<VehicleCost, import("mongoose").Model<VehicleCost, any, any, any, any, any, VehicleCost>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, VehicleCost, Document<unknown, {}, VehicleCost, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<VehicleCost & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    vehicle?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, VehicleCost, Document<unknown, {}, VehicleCost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleCost & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    purchasePrice?: import("mongoose").SchemaDefinitionProperty<number, VehicleCost, Document<unknown, {}, VehicleCost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleCost & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    importCost?: import("mongoose").SchemaDefinitionProperty<number, VehicleCost, Document<unknown, {}, VehicleCost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleCost & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    transportCost?: import("mongoose").SchemaDefinitionProperty<number, VehicleCost, Document<unknown, {}, VehicleCost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleCost & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    repairCost?: import("mongoose").SchemaDefinitionProperty<number, VehicleCost, Document<unknown, {}, VehicleCost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleCost & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    detailingCost?: import("mongoose").SchemaDefinitionProperty<number, VehicleCost, Document<unknown, {}, VehicleCost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleCost & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    registrationCost?: import("mongoose").SchemaDefinitionProperty<number, VehicleCost, Document<unknown, {}, VehicleCost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleCost & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    insuranceCost?: import("mongoose").SchemaDefinitionProperty<number, VehicleCost, Document<unknown, {}, VehicleCost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleCost & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    advertisementCost?: import("mongoose").SchemaDefinitionProperty<number, VehicleCost, Document<unknown, {}, VehicleCost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleCost & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    otherCosts?: import("mongoose").SchemaDefinitionProperty<number, VehicleCost, Document<unknown, {}, VehicleCost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleCost & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    totalInvestment?: import("mongoose").SchemaDefinitionProperty<number, VehicleCost, Document<unknown, {}, VehicleCost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleCost & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    sellingPrice?: import("mongoose").SchemaDefinitionProperty<number, VehicleCost, Document<unknown, {}, VehicleCost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleCost & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    minimumSellingPrice?: import("mongoose").SchemaDefinitionProperty<number, VehicleCost, Document<unknown, {}, VehicleCost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleCost & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    expectedProfit?: import("mongoose").SchemaDefinitionProperty<number, VehicleCost, Document<unknown, {}, VehicleCost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleCost & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, VehicleCost>;

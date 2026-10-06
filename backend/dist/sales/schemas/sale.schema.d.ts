import { Document, Types, Schema as MongooseSchema } from 'mongoose';
export type SaleDocument = Sale & Document;
export declare class Sale {
    invoiceNumber: string;
    customer: Types.ObjectId;
    vehicle: Types.ObjectId;
    salesperson: Types.ObjectId;
    branch: Types.ObjectId;
    vehiclePrice: number;
    discount: number;
    tradeInAllowance: number;
    tradeInVehicleDetails: {
        make?: string;
        model?: string;
        year?: number;
        regNumber?: string;
        valuationAmount?: number;
    };
    leasingProvider: string;
    leasingAmount: number;
    paymentMethod: string;
    salesContractNumber: string;
    additionalCharges: number;
    finalAmount: number;
    paidAmount: number;
    balance: number;
    status: string;
    saleDate: Date;
}
export declare const SaleSchema: MongooseSchema<Sale, import("mongoose").Model<Sale, any, any, any, any, any, Sale>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Sale, Document<unknown, {}, Sale, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Sale & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    invoiceNumber?: import("mongoose").SchemaDefinitionProperty<string, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Sale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    customer?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Sale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    vehicle?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Sale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    salesperson?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Sale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    branch?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Sale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    vehiclePrice?: import("mongoose").SchemaDefinitionProperty<number, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Sale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    discount?: import("mongoose").SchemaDefinitionProperty<number, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Sale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    tradeInAllowance?: import("mongoose").SchemaDefinitionProperty<number, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Sale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    tradeInVehicleDetails?: import("mongoose").SchemaDefinitionProperty<{
        make?: string;
        model?: string;
        year?: number;
        regNumber?: string;
        valuationAmount?: number;
    }, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Sale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    leasingProvider?: import("mongoose").SchemaDefinitionProperty<string, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Sale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    leasingAmount?: import("mongoose").SchemaDefinitionProperty<number, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Sale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    paymentMethod?: import("mongoose").SchemaDefinitionProperty<string, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Sale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    salesContractNumber?: import("mongoose").SchemaDefinitionProperty<string, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Sale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    additionalCharges?: import("mongoose").SchemaDefinitionProperty<number, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Sale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    finalAmount?: import("mongoose").SchemaDefinitionProperty<number, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Sale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    paidAmount?: import("mongoose").SchemaDefinitionProperty<number, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Sale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    balance?: import("mongoose").SchemaDefinitionProperty<number, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Sale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Sale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    saleDate?: import("mongoose").SchemaDefinitionProperty<Date, Sale, Document<unknown, {}, Sale, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Sale & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Sale>;

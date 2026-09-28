import { Document, Types, Schema as MongooseSchema } from 'mongoose';
export type QuotationDocument = Quotation & Document;
export declare class Quotation {
    quotationNumber: string;
    customer: Types.ObjectId;
    vehicle: Types.ObjectId;
    salesperson: Types.ObjectId;
    vehiclePrice: number;
    discount: number;
    registrationFee: number;
    insuranceFee: number;
    otherCharges: number;
    totalAmount: number;
    advancePayment: number;
    validUntil: Date;
}
export declare const QuotationSchema: MongooseSchema<Quotation, import("mongoose").Model<Quotation, any, any, any, any, any, Quotation>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Quotation, Document<unknown, {}, Quotation, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Quotation & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    quotationNumber?: import("mongoose").SchemaDefinitionProperty<string, Quotation, Document<unknown, {}, Quotation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Quotation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    customer?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Quotation, Document<unknown, {}, Quotation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Quotation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    vehicle?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Quotation, Document<unknown, {}, Quotation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Quotation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    salesperson?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Quotation, Document<unknown, {}, Quotation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Quotation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    vehiclePrice?: import("mongoose").SchemaDefinitionProperty<number, Quotation, Document<unknown, {}, Quotation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Quotation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    discount?: import("mongoose").SchemaDefinitionProperty<number, Quotation, Document<unknown, {}, Quotation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Quotation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    registrationFee?: import("mongoose").SchemaDefinitionProperty<number, Quotation, Document<unknown, {}, Quotation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Quotation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    insuranceFee?: import("mongoose").SchemaDefinitionProperty<number, Quotation, Document<unknown, {}, Quotation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Quotation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    otherCharges?: import("mongoose").SchemaDefinitionProperty<number, Quotation, Document<unknown, {}, Quotation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Quotation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    totalAmount?: import("mongoose").SchemaDefinitionProperty<number, Quotation, Document<unknown, {}, Quotation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Quotation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    advancePayment?: import("mongoose").SchemaDefinitionProperty<number, Quotation, Document<unknown, {}, Quotation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Quotation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    validUntil?: import("mongoose").SchemaDefinitionProperty<Date, Quotation, Document<unknown, {}, Quotation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Quotation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Quotation>;

import { Document, Types } from 'mongoose';
export type SupplierPaymentDocument = SupplierPayment & Document;
export declare class SupplierPayment {
    supplier: Types.ObjectId;
    purchase: Types.ObjectId;
    amount: number;
    paymentDate: Date;
    paymentMethod: string;
    referenceNumber: string;
}
export declare const SupplierPaymentSchema: import("mongoose").Schema<SupplierPayment, import("mongoose").Model<SupplierPayment, any, any, any, any, any, SupplierPayment>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SupplierPayment, Document<unknown, {}, SupplierPayment, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<SupplierPayment & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    supplier?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, SupplierPayment, Document<unknown, {}, SupplierPayment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplierPayment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    purchase?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, SupplierPayment, Document<unknown, {}, SupplierPayment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplierPayment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    amount?: import("mongoose").SchemaDefinitionProperty<number, SupplierPayment, Document<unknown, {}, SupplierPayment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplierPayment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    paymentDate?: import("mongoose").SchemaDefinitionProperty<Date, SupplierPayment, Document<unknown, {}, SupplierPayment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplierPayment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    paymentMethod?: import("mongoose").SchemaDefinitionProperty<string, SupplierPayment, Document<unknown, {}, SupplierPayment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplierPayment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    referenceNumber?: import("mongoose").SchemaDefinitionProperty<string, SupplierPayment, Document<unknown, {}, SupplierPayment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplierPayment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, SupplierPayment>;

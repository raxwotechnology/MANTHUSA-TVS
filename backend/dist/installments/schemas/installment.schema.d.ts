import { Document, Types, Schema as MongooseSchema } from 'mongoose';
export type InstallmentDocument = Installment & Document;
export declare class Installment {
    agreement: Types.ObjectId;
    installmentNumber: number;
    dueDate: Date;
    amount: number;
    status: string;
    paidDate: Date;
}
export declare const InstallmentSchema: MongooseSchema<Installment, import("mongoose").Model<Installment, any, any, any, any, any, Installment>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Installment, Document<unknown, {}, Installment, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Installment & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    agreement?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Installment, Document<unknown, {}, Installment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Installment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    installmentNumber?: import("mongoose").SchemaDefinitionProperty<number, Installment, Document<unknown, {}, Installment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Installment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    dueDate?: import("mongoose").SchemaDefinitionProperty<Date, Installment, Document<unknown, {}, Installment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Installment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    amount?: import("mongoose").SchemaDefinitionProperty<number, Installment, Document<unknown, {}, Installment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Installment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Installment, Document<unknown, {}, Installment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Installment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    paidDate?: import("mongoose").SchemaDefinitionProperty<Date, Installment, Document<unknown, {}, Installment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Installment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Installment>;

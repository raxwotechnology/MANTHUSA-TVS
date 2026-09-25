import { Document, Types } from 'mongoose';
export type CashTransactionDocument = CashTransaction & Document;
export declare class CashTransaction {
    transactionType: string;
    amount: number;
    transactionDate: Date;
    source: string;
    referenceId: Types.ObjectId;
    description: string;
}
export declare const CashTransactionSchema: import("mongoose").Schema<CashTransaction, import("mongoose").Model<CashTransaction, any, any, any, any, any, CashTransaction>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CashTransaction, Document<unknown, {}, CashTransaction, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<CashTransaction & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    transactionType?: import("mongoose").SchemaDefinitionProperty<string, CashTransaction, Document<unknown, {}, CashTransaction, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CashTransaction & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    amount?: import("mongoose").SchemaDefinitionProperty<number, CashTransaction, Document<unknown, {}, CashTransaction, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CashTransaction & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    transactionDate?: import("mongoose").SchemaDefinitionProperty<Date, CashTransaction, Document<unknown, {}, CashTransaction, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CashTransaction & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    source?: import("mongoose").SchemaDefinitionProperty<string, CashTransaction, Document<unknown, {}, CashTransaction, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CashTransaction & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    referenceId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, CashTransaction, Document<unknown, {}, CashTransaction, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CashTransaction & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, CashTransaction, Document<unknown, {}, CashTransaction, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CashTransaction & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, CashTransaction>;

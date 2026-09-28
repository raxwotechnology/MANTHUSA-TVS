import { Document, Types, Schema as MongooseSchema } from 'mongoose';
export type SaleItemDocument = SaleItem & Document;
export declare class SaleItem {
    sale: Types.ObjectId;
    description: string;
    amount: number;
    type: string;
}
export declare const SaleItemSchema: MongooseSchema<SaleItem, import("mongoose").Model<SaleItem, any, any, any, any, any, SaleItem>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SaleItem, Document<unknown, {}, SaleItem, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<SaleItem & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    sale?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, SaleItem, Document<unknown, {}, SaleItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SaleItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, SaleItem, Document<unknown, {}, SaleItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SaleItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    amount?: import("mongoose").SchemaDefinitionProperty<number, SaleItem, Document<unknown, {}, SaleItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SaleItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<string, SaleItem, Document<unknown, {}, SaleItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SaleItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, SaleItem>;

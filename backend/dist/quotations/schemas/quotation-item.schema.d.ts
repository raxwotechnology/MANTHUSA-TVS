import { Document, Types, Schema as MongooseSchema } from 'mongoose';
export type QuotationItemDocument = QuotationItem & Document;
export declare class QuotationItem {
    quotation: Types.ObjectId;
    description: string;
    amount: number;
    type: string;
}
export declare const QuotationItemSchema: MongooseSchema<QuotationItem, import("mongoose").Model<QuotationItem, any, any, any, any, any, QuotationItem>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, QuotationItem, Document<unknown, {}, QuotationItem, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<QuotationItem & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    quotation?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, QuotationItem, Document<unknown, {}, QuotationItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<QuotationItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, QuotationItem, Document<unknown, {}, QuotationItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<QuotationItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    amount?: import("mongoose").SchemaDefinitionProperty<number, QuotationItem, Document<unknown, {}, QuotationItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<QuotationItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<string, QuotationItem, Document<unknown, {}, QuotationItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<QuotationItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, QuotationItem>;

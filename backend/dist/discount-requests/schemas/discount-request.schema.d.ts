import { Document, Types } from 'mongoose';
export type DiscountRequestDocument = DiscountRequest & Document;
export declare class DiscountRequest {
    quotation: Types.ObjectId;
    sale: Types.ObjectId;
    requestedBy: Types.ObjectId;
    requestedDiscount: number;
    reason: string;
    status: string;
    approvedBy: Types.ObjectId;
    approvalDate: Date;
}
export declare const DiscountRequestSchema: import("mongoose").Schema<DiscountRequest, import("mongoose").Model<DiscountRequest, any, any, any, any, any, DiscountRequest>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DiscountRequest, Document<unknown, {}, DiscountRequest, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<DiscountRequest & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    quotation?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, DiscountRequest, Document<unknown, {}, DiscountRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DiscountRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    sale?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, DiscountRequest, Document<unknown, {}, DiscountRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DiscountRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    requestedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, DiscountRequest, Document<unknown, {}, DiscountRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DiscountRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    requestedDiscount?: import("mongoose").SchemaDefinitionProperty<number, DiscountRequest, Document<unknown, {}, DiscountRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DiscountRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    reason?: import("mongoose").SchemaDefinitionProperty<string, DiscountRequest, Document<unknown, {}, DiscountRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DiscountRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, DiscountRequest, Document<unknown, {}, DiscountRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DiscountRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    approvedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, DiscountRequest, Document<unknown, {}, DiscountRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DiscountRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    approvalDate?: import("mongoose").SchemaDefinitionProperty<Date, DiscountRequest, Document<unknown, {}, DiscountRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DiscountRequest & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, DiscountRequest>;

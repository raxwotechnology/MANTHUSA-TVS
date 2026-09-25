import { Document, Types } from 'mongoose';
export type RefundDocument = Refund & Document;
export declare class Refund {
    customer: Types.ObjectId;
    sale: Types.ObjectId;
    reservation: Types.ObjectId;
    amount: number;
    refundDate: Date;
    reason: string;
    paymentMethod: string;
    status: string;
}
export declare const RefundSchema: import("mongoose").Schema<Refund, import("mongoose").Model<Refund, any, any, any, any, any, Refund>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Refund, Document<unknown, {}, Refund, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Refund & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    customer?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Refund, Document<unknown, {}, Refund, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Refund & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    sale?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Refund, Document<unknown, {}, Refund, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Refund & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    reservation?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Refund, Document<unknown, {}, Refund, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Refund & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    amount?: import("mongoose").SchemaDefinitionProperty<number, Refund, Document<unknown, {}, Refund, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Refund & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    refundDate?: import("mongoose").SchemaDefinitionProperty<Date, Refund, Document<unknown, {}, Refund, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Refund & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    reason?: import("mongoose").SchemaDefinitionProperty<string, Refund, Document<unknown, {}, Refund, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Refund & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    paymentMethod?: import("mongoose").SchemaDefinitionProperty<string, Refund, Document<unknown, {}, Refund, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Refund & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Refund, Document<unknown, {}, Refund, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Refund & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Refund>;

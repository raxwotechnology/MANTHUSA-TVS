import { Document, Types } from 'mongoose';
export type CommissionDocument = Commission & Document;
export declare class Commission {
    salesperson: Types.ObjectId;
    sale: Types.ObjectId;
    commissionType: string;
    commissionPercentage: number;
    commissionAmount: number;
    status: string;
    paidDate: Date;
}
export declare const CommissionSchema: import("mongoose").Schema<Commission, import("mongoose").Model<Commission, any, any, any, any, any, Commission>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Commission, Document<unknown, {}, Commission, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Commission & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    salesperson?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Commission, Document<unknown, {}, Commission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Commission & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    sale?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Commission, Document<unknown, {}, Commission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Commission & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    commissionType?: import("mongoose").SchemaDefinitionProperty<string, Commission, Document<unknown, {}, Commission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Commission & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    commissionPercentage?: import("mongoose").SchemaDefinitionProperty<number, Commission, Document<unknown, {}, Commission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Commission & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    commissionAmount?: import("mongoose").SchemaDefinitionProperty<number, Commission, Document<unknown, {}, Commission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Commission & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Commission, Document<unknown, {}, Commission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Commission & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    paidDate?: import("mongoose").SchemaDefinitionProperty<Date, Commission, Document<unknown, {}, Commission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Commission & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Commission>;

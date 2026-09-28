import { Document, Types, Schema as MongooseSchema } from 'mongoose';
export type FollowUpDocument = FollowUp & Document;
export declare class FollowUp {
    customer: Types.ObjectId;
    vehicle: Types.ObjectId;
    lead: Types.ObjectId;
    followUpDate: Date;
    followUpTime: string;
    type: string;
    notes: string;
    status: string;
    nextFollowUp: Date;
}
export declare const FollowUpSchema: MongooseSchema<FollowUp, import("mongoose").Model<FollowUp, any, any, any, any, any, FollowUp>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, FollowUp, Document<unknown, {}, FollowUp, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<FollowUp & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    customer?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, FollowUp, Document<unknown, {}, FollowUp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<FollowUp & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    vehicle?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, FollowUp, Document<unknown, {}, FollowUp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<FollowUp & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    lead?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, FollowUp, Document<unknown, {}, FollowUp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<FollowUp & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    followUpDate?: import("mongoose").SchemaDefinitionProperty<Date, FollowUp, Document<unknown, {}, FollowUp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<FollowUp & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    followUpTime?: import("mongoose").SchemaDefinitionProperty<string, FollowUp, Document<unknown, {}, FollowUp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<FollowUp & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<string, FollowUp, Document<unknown, {}, FollowUp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<FollowUp & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    notes?: import("mongoose").SchemaDefinitionProperty<string, FollowUp, Document<unknown, {}, FollowUp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<FollowUp & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, FollowUp, Document<unknown, {}, FollowUp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<FollowUp & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    nextFollowUp?: import("mongoose").SchemaDefinitionProperty<Date, FollowUp, Document<unknown, {}, FollowUp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<FollowUp & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, FollowUp>;

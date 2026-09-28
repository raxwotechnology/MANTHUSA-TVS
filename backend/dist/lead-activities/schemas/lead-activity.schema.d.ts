import { Document, Types, Schema as MongooseSchema } from 'mongoose';
export type LeadActivityDocument = LeadActivity & Document;
export declare class LeadActivity {
    lead: Types.ObjectId;
    performedBy: Types.ObjectId;
    activityType: string;
    oldStatus: string;
    newStatus: string;
    description: string;
}
export declare const LeadActivitySchema: MongooseSchema<LeadActivity, import("mongoose").Model<LeadActivity, any, any, any, any, any, LeadActivity>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, LeadActivity, Document<unknown, {}, LeadActivity, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<LeadActivity & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    lead?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, LeadActivity, Document<unknown, {}, LeadActivity, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeadActivity & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    performedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, LeadActivity, Document<unknown, {}, LeadActivity, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeadActivity & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    activityType?: import("mongoose").SchemaDefinitionProperty<string, LeadActivity, Document<unknown, {}, LeadActivity, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeadActivity & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    oldStatus?: import("mongoose").SchemaDefinitionProperty<string, LeadActivity, Document<unknown, {}, LeadActivity, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeadActivity & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    newStatus?: import("mongoose").SchemaDefinitionProperty<string, LeadActivity, Document<unknown, {}, LeadActivity, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeadActivity & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, LeadActivity, Document<unknown, {}, LeadActivity, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeadActivity & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, LeadActivity>;

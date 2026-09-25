import { Document, Types } from 'mongoose';
export type ComplaintDocument = Complaint & Document;
export declare class Complaint {
    customer: Types.ObjectId;
    vehicle: Types.ObjectId;
    sale: Types.ObjectId;
    priority: string;
    assignedStaff: Types.ObjectId;
    description: string;
    resolution: string;
    status: string;
}
export declare const ComplaintSchema: import("mongoose").Schema<Complaint, import("mongoose").Model<Complaint, any, any, any, any, any, Complaint>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Complaint, Document<unknown, {}, Complaint, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    customer?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    vehicle?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    sale?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    priority?: import("mongoose").SchemaDefinitionProperty<string, Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    assignedStaff?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    resolution?: import("mongoose").SchemaDefinitionProperty<string, Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Complaint>;

import { Document, Types, Schema as MongooseSchema } from 'mongoose';
export type StoredDocument = DocumentRecord & Document;
export declare class DocumentRecord {
    entityType: string;
    entityId: string;
    originalName: string;
    storageName: string;
    mimeType: string;
    size: number;
    uploadedBy: Types.ObjectId;
}
export declare const DocumentSchema: MongooseSchema<DocumentRecord, import("mongoose").Model<DocumentRecord, any, any, any, any, any, DocumentRecord>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DocumentRecord, Document<unknown, {}, DocumentRecord, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<DocumentRecord & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    entityType?: import("mongoose").SchemaDefinitionProperty<string, DocumentRecord, Document<unknown, {}, DocumentRecord, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DocumentRecord & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    entityId?: import("mongoose").SchemaDefinitionProperty<string, DocumentRecord, Document<unknown, {}, DocumentRecord, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DocumentRecord & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    originalName?: import("mongoose").SchemaDefinitionProperty<string, DocumentRecord, Document<unknown, {}, DocumentRecord, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DocumentRecord & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    storageName?: import("mongoose").SchemaDefinitionProperty<string, DocumentRecord, Document<unknown, {}, DocumentRecord, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DocumentRecord & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    mimeType?: import("mongoose").SchemaDefinitionProperty<string, DocumentRecord, Document<unknown, {}, DocumentRecord, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DocumentRecord & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    size?: import("mongoose").SchemaDefinitionProperty<number, DocumentRecord, Document<unknown, {}, DocumentRecord, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DocumentRecord & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    uploadedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, DocumentRecord, Document<unknown, {}, DocumentRecord, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DocumentRecord & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, DocumentRecord>;

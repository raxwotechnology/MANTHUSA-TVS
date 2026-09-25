import { Document } from 'mongoose';
export type BranchDocument = Branch & Document;
export declare class Branch {
    name: string;
    location: string;
    contactNumber: string;
    isActive: boolean;
}
export declare const BranchSchema: import("mongoose").Schema<Branch, import("mongoose").Model<Branch, any, any, any, any, any, Branch>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Branch, Document<unknown, {}, Branch, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Branch & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Branch, Document<unknown, {}, Branch, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Branch & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    location?: import("mongoose").SchemaDefinitionProperty<string, Branch, Document<unknown, {}, Branch, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Branch & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    contactNumber?: import("mongoose").SchemaDefinitionProperty<string, Branch, Document<unknown, {}, Branch, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Branch & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Branch, Document<unknown, {}, Branch, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Branch & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Branch>;

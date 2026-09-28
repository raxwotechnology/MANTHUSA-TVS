import { Document, Types, Schema as MongooseSchema } from 'mongoose';
export type PermissionDocument = Permission & Document;
export declare class Permission {
    role: Types.ObjectId;
    module: string;
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canApprove: boolean;
    canExport: boolean;
}
export declare const PermissionSchema: MongooseSchema<Permission, import("mongoose").Model<Permission, any, any, any, any, any, Permission>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Permission, Document<unknown, {}, Permission, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Permission & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    role?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Permission, Document<unknown, {}, Permission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Permission & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    module?: import("mongoose").SchemaDefinitionProperty<string, Permission, Document<unknown, {}, Permission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Permission & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    canView?: import("mongoose").SchemaDefinitionProperty<boolean, Permission, Document<unknown, {}, Permission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Permission & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    canCreate?: import("mongoose").SchemaDefinitionProperty<boolean, Permission, Document<unknown, {}, Permission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Permission & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    canEdit?: import("mongoose").SchemaDefinitionProperty<boolean, Permission, Document<unknown, {}, Permission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Permission & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    canDelete?: import("mongoose").SchemaDefinitionProperty<boolean, Permission, Document<unknown, {}, Permission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Permission & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    canApprove?: import("mongoose").SchemaDefinitionProperty<boolean, Permission, Document<unknown, {}, Permission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Permission & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    canExport?: import("mongoose").SchemaDefinitionProperty<boolean, Permission, Document<unknown, {}, Permission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Permission & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Permission>;

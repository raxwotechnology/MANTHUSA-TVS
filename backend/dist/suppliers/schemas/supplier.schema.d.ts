import { Document } from 'mongoose';
export type SupplierDocument = Supplier & Document;
export declare class Supplier {
    name: string;
    supplierType: string;
    contactPerson: string;
    phone: string;
    email: string;
    address: string;
    bankDetails: any;
    outstandingBalance: number;
}
export declare const SupplierSchema: import("mongoose").Schema<Supplier, import("mongoose").Model<Supplier, any, any, any, any, any, Supplier>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Supplier, Document<unknown, {}, Supplier, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Supplier & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Supplier, Document<unknown, {}, Supplier, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Supplier & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    supplierType?: import("mongoose").SchemaDefinitionProperty<string, Supplier, Document<unknown, {}, Supplier, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Supplier & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    contactPerson?: import("mongoose").SchemaDefinitionProperty<string, Supplier, Document<unknown, {}, Supplier, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Supplier & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string, Supplier, Document<unknown, {}, Supplier, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Supplier & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string, Supplier, Document<unknown, {}, Supplier, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Supplier & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    address?: import("mongoose").SchemaDefinitionProperty<string, Supplier, Document<unknown, {}, Supplier, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Supplier & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    bankDetails?: import("mongoose").SchemaDefinitionProperty<any, Supplier, Document<unknown, {}, Supplier, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Supplier & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    outstandingBalance?: import("mongoose").SchemaDefinitionProperty<number, Supplier, Document<unknown, {}, Supplier, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Supplier & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Supplier>;

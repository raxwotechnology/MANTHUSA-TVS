import { Document } from 'mongoose';
export type CustomerDocument = Customer & Document;
export declare class Customer {
    fullName: string;
    nicOrPassport: string;
    dateOfBirth: Date;
    gender: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    occupation: string;
    company: string;
    customerType: string;
}
export declare const CustomerSchema: import("mongoose").Schema<Customer, import("mongoose").Model<Customer, any, any, any, any, any, Customer>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Customer, Document<unknown, {}, Customer, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Customer & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    fullName?: import("mongoose").SchemaDefinitionProperty<string, Customer, Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Customer & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    nicOrPassport?: import("mongoose").SchemaDefinitionProperty<string, Customer, Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Customer & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    dateOfBirth?: import("mongoose").SchemaDefinitionProperty<Date, Customer, Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Customer & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    gender?: import("mongoose").SchemaDefinitionProperty<string, Customer, Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Customer & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string, Customer, Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Customer & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string, Customer, Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Customer & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    address?: import("mongoose").SchemaDefinitionProperty<string, Customer, Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Customer & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    city?: import("mongoose").SchemaDefinitionProperty<string, Customer, Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Customer & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    occupation?: import("mongoose").SchemaDefinitionProperty<string, Customer, Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Customer & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    company?: import("mongoose").SchemaDefinitionProperty<string, Customer, Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Customer & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    customerType?: import("mongoose").SchemaDefinitionProperty<string, Customer, Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Customer & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Customer>;

import { Document } from 'mongoose';
export type LeasingPartnerDocument = LeasingPartner & Document;
export declare class LeasingPartner {
    name: string;
    contactPerson: string;
    phone: string;
    email: string;
    address: string;
    defaultInterestRate: number;
    maxLoanTenureMonths: number;
    notes: string;
}
export declare const LeasingPartnerSchema: import("mongoose").Schema<LeasingPartner, import("mongoose").Model<LeasingPartner, any, any, any, any, any, LeasingPartner>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, LeasingPartner, Document<unknown, {}, LeasingPartner, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<LeasingPartner & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    name?: import("mongoose").SchemaDefinitionProperty<string, LeasingPartner, Document<unknown, {}, LeasingPartner, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeasingPartner & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    contactPerson?: import("mongoose").SchemaDefinitionProperty<string, LeasingPartner, Document<unknown, {}, LeasingPartner, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeasingPartner & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string, LeasingPartner, Document<unknown, {}, LeasingPartner, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeasingPartner & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string, LeasingPartner, Document<unknown, {}, LeasingPartner, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeasingPartner & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    address?: import("mongoose").SchemaDefinitionProperty<string, LeasingPartner, Document<unknown, {}, LeasingPartner, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeasingPartner & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    defaultInterestRate?: import("mongoose").SchemaDefinitionProperty<number, LeasingPartner, Document<unknown, {}, LeasingPartner, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeasingPartner & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    maxLoanTenureMonths?: import("mongoose").SchemaDefinitionProperty<number, LeasingPartner, Document<unknown, {}, LeasingPartner, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeasingPartner & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    notes?: import("mongoose").SchemaDefinitionProperty<string, LeasingPartner, Document<unknown, {}, LeasingPartner, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LeasingPartner & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, LeasingPartner>;

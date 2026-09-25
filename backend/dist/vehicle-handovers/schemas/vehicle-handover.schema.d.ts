import { Document, Types } from 'mongoose';
export type VehicleHandoverDocument = VehicleHandover & Document;
export declare class VehicleHandover {
    sale: Types.ObjectId;
    vehicle: Types.ObjectId;
    customer: Types.ObjectId;
    checklist: {
        vehicleInspection: boolean;
        keys: boolean;
        spareKey: boolean;
        cr: boolean;
        insurance: boolean;
        serviceBook: boolean;
        userManual: boolean;
        accessories: boolean;
        numberPlates: boolean;
        customerSignature: boolean;
    };
    status: string;
    handoverDate: Date;
}
export declare const VehicleHandoverSchema: import("mongoose").Schema<VehicleHandover, import("mongoose").Model<VehicleHandover, any, any, any, any, any, VehicleHandover>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, VehicleHandover, Document<unknown, {}, VehicleHandover, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<VehicleHandover & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    sale?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, VehicleHandover, Document<unknown, {}, VehicleHandover, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleHandover & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    vehicle?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, VehicleHandover, Document<unknown, {}, VehicleHandover, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleHandover & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    customer?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, VehicleHandover, Document<unknown, {}, VehicleHandover, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleHandover & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    checklist?: import("mongoose").SchemaDefinitionProperty<{
        vehicleInspection: boolean;
        keys: boolean;
        spareKey: boolean;
        cr: boolean;
        insurance: boolean;
        serviceBook: boolean;
        userManual: boolean;
        accessories: boolean;
        numberPlates: boolean;
        customerSignature: boolean;
    }, VehicleHandover, Document<unknown, {}, VehicleHandover, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleHandover & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, VehicleHandover, Document<unknown, {}, VehicleHandover, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleHandover & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    handoverDate?: import("mongoose").SchemaDefinitionProperty<Date, VehicleHandover, Document<unknown, {}, VehicleHandover, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleHandover & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, VehicleHandover>;

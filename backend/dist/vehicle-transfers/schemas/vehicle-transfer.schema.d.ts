import { Document, Types } from 'mongoose';
export type VehicleTransferDocument = VehicleTransfer & Document;
export declare class VehicleTransfer {
    transferId: string;
    vehicle: Types.ObjectId;
    fromBranch: Types.ObjectId;
    toBranch: Types.ObjectId;
    transferDate: Date;
    driverName: string;
    transportCost: number;
    reason: string;
    status: string;
}
export declare const VehicleTransferSchema: import("mongoose").Schema<VehicleTransfer, import("mongoose").Model<VehicleTransfer, any, any, any, any, any, VehicleTransfer>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, VehicleTransfer, Document<unknown, {}, VehicleTransfer, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<VehicleTransfer & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    transferId?: import("mongoose").SchemaDefinitionProperty<string, VehicleTransfer, Document<unknown, {}, VehicleTransfer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleTransfer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    vehicle?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, VehicleTransfer, Document<unknown, {}, VehicleTransfer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleTransfer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    fromBranch?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, VehicleTransfer, Document<unknown, {}, VehicleTransfer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleTransfer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    toBranch?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, VehicleTransfer, Document<unknown, {}, VehicleTransfer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleTransfer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    transferDate?: import("mongoose").SchemaDefinitionProperty<Date, VehicleTransfer, Document<unknown, {}, VehicleTransfer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleTransfer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    driverName?: import("mongoose").SchemaDefinitionProperty<string, VehicleTransfer, Document<unknown, {}, VehicleTransfer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleTransfer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    transportCost?: import("mongoose").SchemaDefinitionProperty<number, VehicleTransfer, Document<unknown, {}, VehicleTransfer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleTransfer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    reason?: import("mongoose").SchemaDefinitionProperty<string, VehicleTransfer, Document<unknown, {}, VehicleTransfer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleTransfer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, VehicleTransfer, Document<unknown, {}, VehicleTransfer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VehicleTransfer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, VehicleTransfer>;

import { Document, Types } from 'mongoose';
export type ReservationDocument = Reservation & Document;
export declare class Reservation {
    customer: Types.ObjectId;
    vehicle: Types.ObjectId;
    salesperson: Types.ObjectId;
    reservationDeposit: number;
    expiryDate: Date;
    isRefundable: boolean;
    status: string;
    cancellationReason: string;
    refundStatus: string;
}
export declare const ReservationSchema: import("mongoose").Schema<Reservation, import("mongoose").Model<Reservation, any, any, any, any, any, Reservation>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Reservation, Document<unknown, {}, Reservation, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Reservation & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    customer?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Reservation, Document<unknown, {}, Reservation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Reservation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    vehicle?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Reservation, Document<unknown, {}, Reservation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Reservation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    salesperson?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Reservation, Document<unknown, {}, Reservation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Reservation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    reservationDeposit?: import("mongoose").SchemaDefinitionProperty<number, Reservation, Document<unknown, {}, Reservation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Reservation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    expiryDate?: import("mongoose").SchemaDefinitionProperty<Date, Reservation, Document<unknown, {}, Reservation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Reservation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isRefundable?: import("mongoose").SchemaDefinitionProperty<boolean, Reservation, Document<unknown, {}, Reservation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Reservation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Reservation, Document<unknown, {}, Reservation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Reservation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    cancellationReason?: import("mongoose").SchemaDefinitionProperty<string, Reservation, Document<unknown, {}, Reservation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Reservation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    refundStatus?: import("mongoose").SchemaDefinitionProperty<string, Reservation, Document<unknown, {}, Reservation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Reservation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Reservation>;

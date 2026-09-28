import { Model } from 'mongoose';
import { ReservationDocument } from './schemas/reservation.schema';
import { NotificationsService } from '../notifications/notifications.service';
export declare class ReservationsService {
    private readonly reservationModel;
    private readonly vehicleModel;
    private readonly customerModel;
    private readonly notifications;
    constructor(reservationModel: Model<ReservationDocument>, vehicleModel: Model<any>, customerModel: Model<any>, notifications: NotificationsService);
    create(input: any): Promise<import("mongoose").Document<unknown, {}, ReservationDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/reservation.schema").Reservation & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, ReservationDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/reservation.schema").Reservation & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    update(id: string, input: any): Promise<import("mongoose").Document<unknown, {}, ReservationDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/reservation.schema").Reservation & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}

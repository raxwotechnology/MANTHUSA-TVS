import { ReservationsService } from './reservations.service';
export declare class ReservationsController {
    private readonly reservations;
    constructor(reservations: ReservationsService);
    create(body: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/reservation.schema").ReservationDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/reservation.schema").Reservation & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/reservation.schema").ReservationDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/reservation.schema").Reservation & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    update(id: string, body: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/reservation.schema").ReservationDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/reservation.schema").Reservation & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}

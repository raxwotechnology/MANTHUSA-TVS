import { Model } from 'mongoose';
import { PaymentDocument } from './schemas/payment.schema';
import { NotificationsService } from '../notifications/notifications.service';
export declare class PaymentsService {
    private readonly paymentModel;
    private readonly saleModel;
    private readonly cashModel;
    private readonly notifications;
    constructor(paymentModel: Model<PaymentDocument>, saleModel: Model<any>, cashModel: Model<any>, notifications: NotificationsService);
    create(input: any): Promise<import("mongoose").Document<unknown, {}, PaymentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payment.schema").Payment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, PaymentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payment.schema").Payment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}

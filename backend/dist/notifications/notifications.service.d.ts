import { Model } from 'mongoose';
export declare class NotificationsService {
    private readonly model;
    constructor(model: Model<any>);
    create(input: any): any;
    findForUser(userId: string): Promise<any[]>;
    markRead(id: string, userId: string): Promise<any>;
    sendSms(recipientPhone: string, message: string, type?: string): Promise<{
        success: boolean;
        status: string;
        recipient: string;
        notificationId: any;
        gatewayResponse: any;
    }>;
    sendWhatsApp(recipientPhone: string, message: string): Promise<{
        success: boolean;
        status: string;
        recipient: string;
        notificationId: any;
        gatewayResponse: any;
    }>;
}

import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notifications;
    constructor(notifications: NotificationsService);
    findMine(req: any): Promise<any[]>;
    markRead(id: string, req: any): Promise<any>;
    sendSms(body: {
        phone: string;
        message: string;
    }): Promise<void>;
    sendWhatsApp(body: {
        phone: string;
        message: string;
    }): Promise<void>;
}

import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notifications;
    constructor(notifications: NotificationsService);
    findMine(req: any): Promise<any[]>;
    markRead(id: string, req: any): Promise<any>;
    create(body: any): any;
}

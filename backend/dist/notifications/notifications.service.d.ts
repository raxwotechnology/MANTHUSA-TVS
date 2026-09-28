import { Model } from 'mongoose';
export declare class NotificationsService {
    private readonly model;
    constructor(model: Model<any>);
    create(input: any): any;
    findForUser(userId: string): Promise<any[]>;
    markRead(id: string, userId: string): Promise<any>;
}

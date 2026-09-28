import { Model } from 'mongoose';
import { LeadDocument } from './schemas/lead.schema';
import { NotificationsService } from '../notifications/notifications.service';
export declare class LeadsService {
    private leadModel;
    private customerModel;
    private vehicleModel;
    private readonly notifications;
    constructor(leadModel: Model<LeadDocument>, customerModel: Model<any>, vehicleModel: Model<any>, notifications: NotificationsService);
    create(createLeadDto: any): Promise<LeadDocument>;
    createPublicInquiry(input: any): Promise<LeadDocument>;
    findAll(): Promise<LeadDocument[]>;
    findOne(id: string): Promise<LeadDocument>;
    update(id: string, updateLeadDto: any): Promise<LeadDocument>;
    remove(id: string): Promise<any>;
}

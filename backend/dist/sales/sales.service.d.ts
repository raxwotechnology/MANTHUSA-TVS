import { Model } from 'mongoose';
import { SaleDocument } from './schemas/sale.schema';
import { NotificationsService } from '../notifications/notifications.service';
export declare class SalesService {
    private saleModel;
    private vehicleModel;
    private reservations;
    private readonly notifications;
    constructor(saleModel: Model<SaleDocument>, vehicleModel: Model<any>, reservations: Model<any>, notifications: NotificationsService);
    create(createSaleDto: any): Promise<SaleDocument>;
    findAll(): Promise<SaleDocument[]>;
    findOne(id: string): Promise<SaleDocument>;
    update(id: string, updateSaleDto: any): Promise<SaleDocument>;
    remove(id: string): Promise<any>;
}

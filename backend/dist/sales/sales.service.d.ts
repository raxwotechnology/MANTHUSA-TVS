import { Model } from 'mongoose';
import { SaleDocument } from './schemas/sale.schema';
import { NotificationsService } from '../notifications/notifications.service';
export declare class SalesService {
    private saleModel;
    private vehicleModel;
    private customerModel;
    private reservations;
    private readonly notifications;
    constructor(saleModel: Model<SaleDocument>, vehicleModel: Model<any>, customerModel: Model<any>, reservations: Model<any>, notifications: NotificationsService);
    create(createSaleDto: any): Promise<SaleDocument>;
    findAll(): Promise<SaleDocument[]>;
    findOne(id: string): Promise<SaleDocument>;
    update(id: string, updateSaleDto: any): Promise<SaleDocument>;
    getSalesContract(id: string): Promise<{
        contractTitle: string;
        contractNumber: string;
        invoiceNumber: string;
        date: Date;
        seller: {
            companyName: string;
            registrationNumber: string;
            address: string;
            phone: string;
            email: string;
        };
        buyer: {
            name: any;
            nicOrPassport: any;
            address: any;
            phone: any;
            email: any;
        };
        vehicle: {
            stockNumber: any;
            vin: any;
            engineNumber: any;
            make: any;
            model: any;
            year: any;
            color: any;
            registrationNumber: any;
        };
        financials: {
            vehiclePrice: number;
            discount: number;
            tradeInAllowance: number;
            additionalCharges: number;
            totalAmount: number;
            paidAmount: number;
            balanceDue: number;
            paymentMethod: string;
        };
        tradeIn: {
            make?: string;
            model?: string;
            year?: number;
            regNumber?: string;
            valuationAmount?: number;
        };
        termsAndConditions: string[];
    }>;
    remove(id: string): Promise<any>;
}

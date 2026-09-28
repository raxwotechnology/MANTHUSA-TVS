import { Model } from 'mongoose';
import { CustomerDocument } from './schemas/customer.schema';
export declare class CustomersService {
    private customerModel;
    private leads;
    private followUps;
    private testDrives;
    private quotations;
    private reservations;
    private payments;
    private sales;
    private handovers;
    private complaints;
    private afterSales;
    constructor(customerModel: Model<CustomerDocument>, leads: Model<any>, followUps: Model<any>, testDrives: Model<any>, quotations: Model<any>, reservations: Model<any>, payments: Model<any>, sales: Model<any>, handovers: Model<any>, complaints: Model<any>, afterSales: Model<any>);
    create(createCustomerDto: any): Promise<CustomerDocument>;
    findAll(): Promise<CustomerDocument[]>;
    findOne(id: string): Promise<CustomerDocument>;
    timeline(id: string): Promise<{
        type: "Lead" | "Quotation" | "Reservation" | "Payment" | "Sale" | "Complaint" | "Follow-up" | "Test drive" | "Handover" | "After-sales";
        date: any;
        detail: string;
        id: any;
    }[]>;
    update(id: string, updateCustomerDto: any): Promise<CustomerDocument>;
    remove(id: string): Promise<any>;
}

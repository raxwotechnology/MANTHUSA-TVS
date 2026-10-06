import { SalesService } from './sales.service';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    create(createSaleDto: any, request: any): Promise<import("./schemas/sale.schema").SaleDocument>;
    findAll(): Promise<import("./schemas/sale.schema").SaleDocument[]>;
    findOne(id: string): Promise<import("./schemas/sale.schema").SaleDocument>;
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
    update(id: string, updateSaleDto: any): Promise<import("./schemas/sale.schema").SaleDocument>;
    remove(id: string): Promise<any>;
}

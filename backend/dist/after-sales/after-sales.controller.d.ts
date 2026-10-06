import { AfterSalesService } from './after-sales.service';
export declare class AfterSalesController {
    private readonly afterSales;
    constructor(afterSales: AfterSalesService);
    create(body: any): any;
    findAll(): Promise<any[]>;
    getMta6Form(id: string): Promise<{
        formTitle: string;
        formNumber: string;
        department: string;
        transferor: {
            name: any;
            nicOrReg: any;
            address: any;
        };
        transferee: {
            name: any;
            nicOrPassport: any;
            address: any;
            phone: any;
            email: any;
        };
        vehicle: {
            registrationNumber: any;
            chassisNumber: any;
            engineNumber: any;
            make: any;
            model: any;
            manufacturingYear: any;
            fuelType: any;
            engineCapacity: any;
            color: any;
        };
        transferDetails: {
            saleDate: any;
            rmvReference: any;
            status: any;
            notes: any;
        };
    }>;
    getMta8Form(id: string): Promise<{
        formTitle: string;
        formNumber: string;
        department: string;
        registeredOwner: {
            name: any;
            nic: any;
            address: any;
        };
        newOwner: {
            name: any;
            nic: any;
            address: any;
        };
        vehicleDetails: {
            regNo: any;
            chassisNo: any;
            engineNo: any;
            makeModel: string;
        };
        noticeDetails: {
            dateOfDisposal: any;
            status: any;
        };
    }>;
    update(id: string, body: any): Promise<any>;
    remove(id: string): Promise<any>;
}

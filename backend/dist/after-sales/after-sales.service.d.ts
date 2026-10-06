import { Model } from 'mongoose';
export declare class AfterSalesService {
    private readonly model;
    constructor(model: Model<any>);
    create(input: any): any;
    findAll(): Promise<any[]>;
    update(id: string, input: any): Promise<any>;
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
    remove(id: string): Promise<any>;
}

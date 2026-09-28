import { Model } from 'mongoose';
export declare class InstallmentsService {
    private readonly installments;
    private readonly agreements;
    private readonly sales;
    private readonly cash;
    constructor(installments: Model<any>, agreements: Model<any>, sales: Model<any>, cash: Model<any>);
    createAgreement(input: any): Promise<{
        agreement: any;
        schedule: {
            agreement: any;
            installmentNumber: number;
            dueDate: Date;
            amount: number;
            status: string;
        }[];
    }>;
    listAgreements(): Promise<any[]>;
    getSchedule(agreementId: string): Promise<any[]>;
    markPaid(id: string, input: any): Promise<any>;
}

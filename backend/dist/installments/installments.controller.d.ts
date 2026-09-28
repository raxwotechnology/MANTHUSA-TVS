import { InstallmentsService } from './installments.service';
export declare class InstallmentsController {
    private readonly installments;
    constructor(installments: InstallmentsService);
    createAgreement(body: any): Promise<{
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
    getSchedule(id: string): Promise<any[]>;
    markPaid(id: string, body: any): Promise<any>;
}

import { SupplierPaymentsService } from './supplier-payments.service';
export declare class SupplierPaymentsController {
    private readonly payments;
    constructor(payments: SupplierPaymentsService);
    create(body: any): Promise<any>;
    findAll(): Promise<any[]>;
}

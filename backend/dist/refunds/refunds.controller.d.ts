import { RefundsService } from './refunds.service';
export declare class RefundsController {
    private readonly refunds;
    constructor(refunds: RefundsService);
    create(body: any): Promise<any>;
    findAll(): Promise<any[]>;
}

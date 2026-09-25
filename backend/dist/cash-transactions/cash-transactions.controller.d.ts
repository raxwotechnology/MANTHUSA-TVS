import { CashTransactionsService } from './cash-transactions.service';
export declare class CashTransactionsController {
    private readonly cashTxService;
    constructor(cashTxService: CashTransactionsService);
    create(createTxDto: any): Promise<import("./schemas/cash-transaction.schema").CashTransactionDocument>;
    findAll(): Promise<import("./schemas/cash-transaction.schema").CashTransactionDocument[]>;
    findOne(id: string): Promise<import("./schemas/cash-transaction.schema").CashTransactionDocument>;
}

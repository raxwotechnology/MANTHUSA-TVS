import { Model } from 'mongoose';
import { CashTransactionDocument } from './schemas/cash-transaction.schema';
export declare class CashTransactionsService {
    private cashTxModel;
    constructor(cashTxModel: Model<CashTransactionDocument>);
    create(createTxDto: any): Promise<CashTransactionDocument>;
    findAll(): Promise<CashTransactionDocument[]>;
    findOne(id: string): Promise<CashTransactionDocument>;
}

import { Model } from 'mongoose';
import { ExpenseDocument } from './schemas/expense.schema';
export declare class ExpensesService {
    private expenseModel;
    constructor(expenseModel: Model<ExpenseDocument>);
    create(createExpenseDto: any): Promise<ExpenseDocument>;
    findAll(): Promise<ExpenseDocument[]>;
    findOne(id: string): Promise<ExpenseDocument>;
    update(id: string, updateExpenseDto: any): Promise<ExpenseDocument>;
    remove(id: string): Promise<any>;
}

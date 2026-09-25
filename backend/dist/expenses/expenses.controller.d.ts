import { ExpensesService } from './expenses.service';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    create(createExpenseDto: any): Promise<import("./schemas/expense.schema").ExpenseDocument>;
    findAll(): Promise<import("./schemas/expense.schema").ExpenseDocument[]>;
    findOne(id: string): Promise<import("./schemas/expense.schema").ExpenseDocument>;
    update(id: string, updateExpenseDto: any): Promise<import("./schemas/expense.schema").ExpenseDocument>;
    remove(id: string): Promise<any>;
}

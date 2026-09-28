import { ExpenseCategoriesService } from './expense-categories.service';
export declare class ExpenseCategoriesController {
    private readonly categories;
    constructor(categories: ExpenseCategoriesService);
    create(body: any): Promise<any>;
    findAll(): Promise<any[]>;
    remove(id: string): Promise<any>;
}

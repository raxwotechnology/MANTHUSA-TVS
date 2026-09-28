import { SuppliersService } from './suppliers.service';
export declare class SuppliersController {
    private readonly suppliers;
    constructor(suppliers: SuppliersService);
    create(body: any): any;
    findAll(): Promise<any[]>;
    update(id: string, body: any): Promise<any>;
    remove(id: string): Promise<any>;
}

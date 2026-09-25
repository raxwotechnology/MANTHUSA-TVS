import { CustomersService } from './customers.service';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(createCustomerDto: any): Promise<import("./schemas/customer.schema").CustomerDocument>;
    findAll(): Promise<import("./schemas/customer.schema").CustomerDocument[]>;
    findOne(id: string): Promise<import("./schemas/customer.schema").CustomerDocument>;
    update(id: string, updateCustomerDto: any): Promise<import("./schemas/customer.schema").CustomerDocument>;
    remove(id: string): Promise<any>;
}

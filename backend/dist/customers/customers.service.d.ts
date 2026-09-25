import { Model } from 'mongoose';
import { CustomerDocument } from './schemas/customer.schema';
export declare class CustomersService {
    private customerModel;
    constructor(customerModel: Model<CustomerDocument>);
    create(createCustomerDto: any): Promise<CustomerDocument>;
    findAll(): Promise<CustomerDocument[]>;
    findOne(id: string): Promise<CustomerDocument>;
    update(id: string, updateCustomerDto: any): Promise<CustomerDocument>;
    remove(id: string): Promise<any>;
}

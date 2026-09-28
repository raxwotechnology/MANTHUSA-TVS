import { DiscountRequestsService } from './discount-requests.service';
export declare class DiscountRequestsController {
    private readonly requests;
    constructor(requests: DiscountRequestsService);
    create(body: any, request: any): Promise<any>;
    findAll(): Promise<any[]>;
    decide(id: string, body: any, request: any): Promise<any>;
}

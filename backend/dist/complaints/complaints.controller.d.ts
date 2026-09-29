import { ComplaintsService } from './complaints.service';
export declare class ComplaintsController {
    private readonly complaints;
    constructor(complaints: ComplaintsService);
    create(body: any): any;
    findAll(): Promise<any[]>;
    update(id: string, body: any): Promise<any>;
    remove(id: string): Promise<any>;
}

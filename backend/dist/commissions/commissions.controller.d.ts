import { CommissionsService } from './commissions.service';
export declare class CommissionsController {
    private readonly commissions;
    constructor(commissions: CommissionsService);
    create(body: any): Promise<any>;
    findAll(): Promise<any[]>;
    update(id: string, body: any): Promise<any>;
    remove(id: string): Promise<any>;
}

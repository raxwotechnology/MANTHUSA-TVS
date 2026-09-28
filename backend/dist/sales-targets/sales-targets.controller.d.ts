import { SalesTargetsService } from './sales-targets.service';
export declare class SalesTargetsController {
    private readonly targets;
    constructor(targets: SalesTargetsService);
    create(body: any): Promise<any>;
    findAll(): Promise<any[]>;
    update(id: string, body: any): Promise<any>;
}

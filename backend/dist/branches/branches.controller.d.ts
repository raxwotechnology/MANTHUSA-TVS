import { BranchesService } from './branches.service';
export declare class BranchesController {
    private readonly branches;
    constructor(branches: BranchesService);
    create(body: any): any;
    findAll(): Promise<any[]>;
    update(id: string, body: any): Promise<any>;
    remove(id: string): Promise<any>;
}

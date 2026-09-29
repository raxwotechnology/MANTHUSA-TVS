import { TestDrivesService } from './test-drives.service';
export declare class TestDrivesController {
    private readonly drives;
    constructor(drives: TestDrivesService);
    create(body: any): any;
    findAll(): Promise<any[]>;
    update(id: string, body: any): Promise<any>;
    remove(id: string): Promise<any>;
}

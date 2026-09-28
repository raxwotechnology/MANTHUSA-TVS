import { PermissionsService } from './permissions.service';
export declare class PermissionsController {
    private readonly permissions;
    constructor(permissions: PermissionsService);
    set(body: any): Promise<any>;
    findAll(): Promise<any[]>;
    remove(id: string): Promise<any>;
}

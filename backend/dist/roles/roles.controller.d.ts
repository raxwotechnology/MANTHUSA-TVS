import { RolesService } from './roles.service';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    create(createRoleDto: any): Promise<any>;
    findAll(): Promise<any[]>;
}

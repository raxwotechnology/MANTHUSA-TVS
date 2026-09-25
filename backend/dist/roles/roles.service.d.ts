import { Model } from 'mongoose';
export declare class RolesService {
    private roleModel;
    constructor(roleModel: Model<any>);
    findAll(): Promise<any[]>;
    create(createRoleDto: any): Promise<any>;
}

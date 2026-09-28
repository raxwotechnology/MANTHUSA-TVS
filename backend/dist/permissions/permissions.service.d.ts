import { Model } from 'mongoose';
export declare class PermissionsService {
    private readonly model;
    constructor(model: Model<any>);
    set(input: any): Promise<any>;
    findAll(): Promise<any[]>;
    remove(id: string): Promise<any>;
}

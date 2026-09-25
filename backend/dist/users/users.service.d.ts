import { Model } from 'mongoose';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<any>);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(createUserDto: any): Promise<any>;
    update(id: string, updateUserDto: any): Promise<any>;
    remove(id: string): Promise<any>;
}

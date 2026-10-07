import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: any): Promise<any>;
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateUserDto: any): Promise<any>;
    updatePut(id: string, updateUserDto: any): Promise<any>;
    remove(id: string): Promise<any>;
}

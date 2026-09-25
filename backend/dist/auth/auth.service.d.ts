import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<any>, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
        };
    }>;
}

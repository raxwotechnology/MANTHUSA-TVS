import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<any>, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    private digest;
    private sendEmail;
    requestPasswordReset(emailInput: string): Promise<{
        message: string;
    }>;
    resetPassword(tokenInput: string, newPassword: string): Promise<{
        message: string;
    }>;
    requestEmailVerification(emailInput: string): Promise<{
        message: string;
    }>;
    verifyEmail(tokenInput: string): Promise<{
        message: string;
    }>;
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

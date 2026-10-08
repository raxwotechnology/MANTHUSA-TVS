import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private userModel;
    private roleModel;
    private customerModel;
    private jwtService;
    constructor(userModel: Model<any>, roleModel: Model<any>, customerModel: Model<any>, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    registerCustomer(input: {
        name: string;
        email: string;
        password: string;
        phone: string;
        address?: string;
        city?: string;
    }): Promise<{
        mfaRequired: boolean;
        userId: any;
        email: any;
        message: string;
        access_token?: undefined;
        user?: undefined;
    } | {
        access_token: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
            mfaEnabled: boolean;
            customerId: any;
        };
        mfaRequired?: undefined;
        userId?: undefined;
        email?: undefined;
        message?: undefined;
    }>;
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
    setupMfa(userId: string): Promise<{
        secret: string;
        otpAuthUrl: string;
        backupCodes: string[];
    }>;
    verifyMfaToken(userId: string, code: string): Promise<boolean>;
    enableMfa(userId: string, code: string, backupCodes: string[]): Promise<{
        message: string;
    }>;
    disableMfa(userId: string, code: string): Promise<{
        message: string;
    }>;
    login(user: any): Promise<{
        mfaRequired: boolean;
        userId: any;
        email: any;
        message: string;
        access_token?: undefined;
        user?: undefined;
    } | {
        access_token: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
            mfaEnabled: boolean;
            customerId: any;
        };
        mfaRequired?: undefined;
        userId?: undefined;
        email?: undefined;
        message?: undefined;
    }>;
    completeMfaLogin(userId: string, code: string): Promise<{
        access_token: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
            mfaEnabled: boolean;
            customerId: any;
        };
    }>;
}

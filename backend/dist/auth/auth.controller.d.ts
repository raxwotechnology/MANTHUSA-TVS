import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    private readonly attempts;
    private readonly recoveryAttempts;
    private readonly mfaAttempts;
    constructor(authService: AuthService);
    register(body: any): Promise<{
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
    login(loginDto: any, request: any): Promise<{
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
    forgotPassword(body: any, request: any): Promise<{
        message: string;
    }>;
    resetPassword(body: any): Promise<{
        message: string;
    }>;
    requestEmailVerification(body: any, request: any): Promise<{
        message: string;
    }>;
    verifyEmail(body: any): Promise<{
        message: string;
    }>;
    verifyMfaLogin(body: any, request: any): Promise<{
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
    setupMfa(req: any): Promise<{
        secret: string;
        otpAuthUrl: string;
        backupCodes: string[];
    }>;
    enableMfa(req: any, body: any): Promise<{
        message: string;
    }>;
    disableMfa(req: any, body: any): Promise<{
        message: string;
    }>;
    private limitRecovery;
    private limitMfa;
}

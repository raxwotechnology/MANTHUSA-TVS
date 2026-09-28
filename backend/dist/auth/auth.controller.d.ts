import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    private readonly attempts;
    private readonly recoveryAttempts;
    constructor(authService: AuthService);
    login(loginDto: any, request: any): Promise<{
        access_token: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
        };
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
    private limitRecovery;
}

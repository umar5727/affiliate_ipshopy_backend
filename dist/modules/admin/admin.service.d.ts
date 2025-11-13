import { AuthenticatedUser } from '../../types';
export declare const requestOtp: (mobileNumber: string) => Promise<string>;
export declare const verifyOtp: (mobileNumber: string, otp: string) => Promise<{
    admin: AuthenticatedUser;
    tokens: {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    };
}>;
export declare const refreshTokens: (refreshToken: string) => Promise<{
    admin: AuthenticatedUser;
    tokens: {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    };
}>;
//# sourceMappingURL=admin.service.d.ts.map
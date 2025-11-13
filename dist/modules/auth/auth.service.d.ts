import { AuthenticatedUser } from '../../types';
import { OtpVerifyPayload } from '.';
export declare const requestOtp: (mobileNumber: string) => Promise<string>;
export declare const verifyOtp: (payload: OtpVerifyPayload) => Promise<{
    isNew: boolean;
    user: AuthenticatedUser;
    tokens: {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    };
}>;
export declare const refreshTokens: (refreshToken: string) => Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}>;
//# sourceMappingURL=auth.service.d.ts.map
import { AuthenticatedUser } from '../types';
interface RefreshTokenPayload {
    sub: number;
    tokenId: string;
}
export declare const signAccessToken: (user: AuthenticatedUser) => string;
export declare const signRefreshToken: (userId: number, tokenId: string) => string;
export declare const verifyAccessToken: (token: string) => AuthenticatedUser;
export declare const verifyRefreshToken: (token: string) => RefreshTokenPayload;
export {};
//# sourceMappingURL=jwt.d.ts.map
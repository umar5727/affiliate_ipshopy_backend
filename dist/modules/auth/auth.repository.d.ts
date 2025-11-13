import { PoolConnection } from 'mysql2/promise';
import { Affiliate } from '../affiliates/affiliate.types';
export declare const upsertOtp: (mobileNumber: string, otp: string, ttlMinutes: number) => Promise<void>;
export declare const validateOtp: (mobileNumber: string, otp: string) => Promise<boolean>;
export declare const findUserByMobile: (mobileNumber: string) => Promise<Affiliate | null>;
export declare const createAffiliate: (input: import("../affiliates/affiliate.types").CreateAffiliateInput, connection?: PoolConnection) => Promise<Affiliate>;
export declare const markWhatsAppVerified: (userId: number, connection?: PoolConnection) => Promise<void>;
export declare const storeRefreshToken: (userId: number, tokenId: string, expiresInDays: number, connection?: PoolConnection) => Promise<void>;
export declare const revokeRefreshToken: (tokenId: string) => Promise<void>;
export declare const findRefreshToken: (tokenId: string) => Promise<{
    userId: number;
    expiresAt: Date;
} | null>;
//# sourceMappingURL=auth.repository.d.ts.map
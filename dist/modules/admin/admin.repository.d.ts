import { AdminUser } from './admin.types';
export declare const findByMobile: (mobileNumber: string) => Promise<AdminUser | null>;
export declare const findById: (adminId: number) => Promise<AdminUser | null>;
export declare const markWhatsAppVerified: (adminId: number) => Promise<void>;
export declare const storeRefreshToken: (adminId: number, tokenId: string, expiresInDays: number) => Promise<void>;
export declare const revokeRefreshToken: (tokenId: string) => Promise<void>;
export declare const findRefreshToken: (tokenId: string) => Promise<{
    adminUserId: number;
    expiresAt: Date;
} | null>;
//# sourceMappingURL=admin.repository.d.ts.map
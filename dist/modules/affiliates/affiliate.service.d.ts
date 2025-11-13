import { CreateAffiliateInput, UpdateAffiliateInput } from './affiliate.types';
export declare const getAffiliateById: (id: number, connection?: import("mysql2/promise").PoolConnection) => Promise<import("./affiliate.types").Affiliate | null>;
export declare const listAffiliates: (query: Partial<Record<string, string>>) => Promise<import("../../types").PaginatedResult<import("./affiliate.types").Affiliate>>;
export declare const createAffiliate: (payload: CreateAffiliateInput) => Promise<import("./affiliate.types").Affiliate>;
export declare const updateAffiliate: (id: number, payload: UpdateAffiliateInput) => Promise<import("./affiliate.types").Affiliate | null>;
export declare const findByMobile: (mobileNumber: string) => Promise<import("./affiliate.types").Affiliate | null>;
//# sourceMappingURL=affiliate.service.d.ts.map
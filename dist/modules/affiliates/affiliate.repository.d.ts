import { PoolConnection } from 'mysql2/promise';
import { PaginatedResult } from '../../types';
import { Affiliate, CreateAffiliateInput, UpdateAffiliateInput } from './affiliate.types';
interface AffiliateQueryFilters {
    status?: string;
    search?: string;
    page: number;
    pageSize: number;
}
export declare const findByMobile: (mobileNumber: string) => Promise<Affiliate | null>;
export declare const findById: (id: number, connection?: PoolConnection) => Promise<Affiliate | null>;
export declare const createAffiliate: (input: CreateAffiliateInput, connection?: PoolConnection) => Promise<Affiliate>;
export declare const updateAffiliate: (id: number, input: UpdateAffiliateInput, connection?: PoolConnection) => Promise<Affiliate | null>;
export declare const listAffiliates: (filters: AffiliateQueryFilters) => Promise<PaginatedResult<Affiliate>>;
export {};
//# sourceMappingURL=affiliate.repository.d.ts.map
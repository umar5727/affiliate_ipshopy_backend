import { CreateLinkInput, AffiliateLink } from './link.types';
export declare const createLink: (payload: CreateLinkInput) => Promise<AffiliateLink>;
export declare const listLinks: (query: Partial<Record<string, string>>) => Promise<import("../../types").PaginatedResult<AffiliateLink>>;
export declare const updateLinkStatus: (id: number, payload: {
    status: "approved" | "rejected";
    adminRemarks?: string | null;
}) => Promise<AffiliateLink | null>;
//# sourceMappingURL=link.repository.d.ts.map
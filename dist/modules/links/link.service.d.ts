import { CreateLinkInput } from './link.types';
export declare const listLinks: (query: Partial<Record<string, string>>) => Promise<import("../../types").PaginatedResult<import("./link.types").AffiliateLink>>;
export declare const createLink: (payload: CreateLinkInput) => Promise<import("./link.types").AffiliateLink>;
export declare const updateLinkStatus: (id: number, payload: {
    status: "approved" | "rejected";
    adminRemarks?: string | null;
}) => Promise<import("./link.types").AffiliateLink | null>;
//# sourceMappingURL=link.service.d.ts.map
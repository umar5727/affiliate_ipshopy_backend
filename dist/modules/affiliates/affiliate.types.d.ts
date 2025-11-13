export interface Affiliate {
    id: number;
    name: string;
    mobileNumber: string;
    whatsappVerified: number;
    role: 'affiliate' | 'admin';
    channelLink: string | null;
    appLink: string | null;
    websiteLink: string | null;
    status: 'pending' | 'active' | 'suspended';
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateAffiliateInput {
    name: string;
    mobileNumber: string;
    role?: 'affiliate' | 'admin';
    channelLink?: string | null;
    appLink?: string | null;
    websiteLink?: string | null;
    status?: 'pending' | 'active' | 'suspended';
}
export interface UpdateAffiliateInput {
    name?: string;
    channelLink?: string | null;
    appLink?: string | null;
    websiteLink?: string | null;
    status?: 'pending' | 'active' | 'suspended';
}
//# sourceMappingURL=affiliate.types.d.ts.map
export interface OverviewMetrics {
    lifetimeClicks: number;
    confirmedOrders: number;
    pendingCommission: number;
    confirmedCommission: number;
    paidOut: number;
    withdrawableCommission: number;
}
export interface LinkPerformance {
    id: number;
    url: string;
    source: string | null;
    createdAt: Date;
    clicks: number;
    orders: number;
    earnings: number;
    status: 'pending' | 'approved' | 'rejected';
    adminRemarks: string | null;
}
export declare const getOverviewMetrics: (userId?: number) => Promise<OverviewMetrics>;
export declare const getLinkPerformance: (userId?: number) => Promise<LinkPerformance[]>;
//# sourceMappingURL=analytics.service.d.ts.map
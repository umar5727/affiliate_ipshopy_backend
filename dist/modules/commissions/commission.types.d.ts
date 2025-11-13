export interface Commission {
    id: number;
    orderId: number;
    affiliateLinkId: number | null;
    amount: number;
    status: 'pending' | 'confirmed' | 'returned';
    confirmationDate: Date | null;
    createdAt: Date;
}
export interface UpdateCommissionStatusInput {
    status: 'pending' | 'confirmed' | 'returned';
    confirmationDate?: Date | null;
}
export interface CreateCommissionInput {
    orderId: number;
    affiliateLinkId?: number | null;
    amount: number;
    status?: 'pending' | 'confirmed' | 'returned';
    confirmationDate?: Date | null;
}
//# sourceMappingURL=commission.types.d.ts.map
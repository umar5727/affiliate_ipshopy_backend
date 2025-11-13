export type Role = 'affiliate' | 'admin';
export interface AuthenticatedUser {
    id: number;
    role: Role;
    name: string;
    mobileNumber: string;
    status: 'active' | 'suspended' | 'pending';
}
export interface PaginationParams {
    page: number;
    pageSize: number;
}
export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}
//# sourceMappingURL=index.d.ts.map
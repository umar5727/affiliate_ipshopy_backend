import { PaginationParams, PaginatedResult } from '../types';
export declare const parsePagination: (query: Partial<Record<string, string>>) => PaginationParams;
export declare const buildPagination: <T>(data: T[], page: number, pageSize: number, total: number) => PaginatedResult<T>;
//# sourceMappingURL=pagination.d.ts.map
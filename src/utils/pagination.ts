import { PaginationParams, PaginatedResult } from '../types';

export const parsePagination = (query: Partial<Record<string, string>>): PaginationParams => {
  const page = Math.max(parseInt(query.page ?? '1', 10), 1);
  const pageSize = Math.max(Math.min(parseInt(query.pageSize ?? '20', 10), 100), 1);
  return { page, pageSize };
};

export const buildPagination = <T>(data: T[], page: number, pageSize: number, total: number): PaginatedResult<T> => ({
  data,
  pagination: {
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  },
});


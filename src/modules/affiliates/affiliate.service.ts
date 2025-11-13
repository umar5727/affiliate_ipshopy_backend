import { withTransaction } from '../../config/database';
import { PaginationParams } from '../../types';
import { parsePagination } from '../../utils/pagination';
import { CreateAffiliateInput, UpdateAffiliateInput } from './affiliate.types';
import * as repository from './affiliate.repository';

export const getAffiliateById = repository.findById;

export const listAffiliates = async (query: Partial<Record<string, string>>) => {
  const { page, pageSize } = parsePagination(query);
  return repository.listAffiliates({
    page,
    pageSize,
    status: query.status,
    search: query.search,
  });
};

export const createAffiliate = async (payload: CreateAffiliateInput) => {
  return withTransaction((connection) => repository.createAffiliate(payload, connection));
};

export const updateAffiliate = async (id: number, payload: UpdateAffiliateInput) => {
  return withTransaction((connection) => repository.updateAffiliate(id, payload, connection));
};

export const findByMobile = repository.findByMobile;


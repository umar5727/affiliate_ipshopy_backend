import { PoolConnection, ResultSetHeader } from 'mysql2/promise';
import { execute } from '../../config/database';
import { buildPagination } from '../../utils/pagination';
import { PaginatedResult } from '../../types';
import { Affiliate, CreateAffiliateInput, UpdateAffiliateInput } from './affiliate.types';

interface AffiliateQueryFilters {
  status?: string;
  search?: string;
  page: number;
  pageSize: number;
}

const baseSelect = `
  SELECT
    id,
    name,
    mobile_number AS mobileNumber,
    whatsapp_verified AS whatsappVerified,
    role,
    channel_link AS channelLink,
    app_link AS appLink,
    website_link AS websiteLink,
    status,
    created_at AS createdAt,
    updated_at AS updatedAt
  FROM users
`;

export const findByMobile = async (mobileNumber: string): Promise<Affiliate | null> => {
  const [rows] = await execute<Affiliate[]>(
    `${baseSelect} WHERE mobile_number = ? LIMIT 1`,
    [mobileNumber],
  );
  return rows[0] ?? null;
};

export const findById = async (id: number, connection?: PoolConnection): Promise<Affiliate | null> => {
  const [rows] = await execute<Affiliate[]>(`${baseSelect} WHERE id = ? LIMIT 1`, [id], connection);
  return rows[0] ?? null;
};

export const createAffiliate = async (input: CreateAffiliateInput, connection?: PoolConnection): Promise<Affiliate> => {
  const [result] = await execute<ResultSetHeader>(
    `
    INSERT INTO users (name, mobile_number, whatsapp_verified, role, channel_link, app_link, website_link, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,
    [
      input.name,
      input.mobileNumber,
      0,
      input.role ?? 'affiliate',
      input.channelLink ?? null,
      input.appLink ?? null,
      input.websiteLink ?? null,
      input.status ?? 'pending',
    ],
    connection,
  );

  const created = await findById(result.insertId, connection);
  if (!created) {
    throw new Error('Failed to create affiliate');
  }
  return created;
};

export const updateAffiliate = async (
  id: number,
  input: UpdateAffiliateInput,
  connection?: PoolConnection,
): Promise<Affiliate | null> => {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (input.name !== undefined) {
    fields.push('name = ?');
    values.push(input.name);
  }
  if (input.channelLink !== undefined) {
    fields.push('channel_link = ?');
    values.push(input.channelLink);
  }
  if (input.appLink !== undefined) {
    fields.push('app_link = ?');
    values.push(input.appLink);
  }
  if (input.websiteLink !== undefined) {
    fields.push('website_link = ?');
    values.push(input.websiteLink);
  }
  if (input.status !== undefined) {
    fields.push('status = ?');
    values.push(input.status);
  }

  if (fields.length === 0) {
    return findById(id);
  }

  values.push(id);
  await execute(`UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`, values, connection);
  return findById(id, connection);
};

export const listAffiliates = async (filters: AffiliateQueryFilters): Promise<PaginatedResult<Affiliate>> => {
  const where: string[] = [];
  const params: unknown[] = [];

  if (filters.status) {
    where.push('status = ?');
    params.push(filters.status);
  }

  if (filters.search) {
    where.push('(name LIKE ? OR mobile_number LIKE ?)');
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const offset = (filters.page - 1) * filters.pageSize;
  const [rows] = await execute<Affiliate[]>(
    `${baseSelect} ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...params, filters.pageSize, offset],
  );

  const [countRows] = await execute<Array<{ total: number }>>(
    `SELECT COUNT(*) AS total FROM users ${whereClause}`,
    params,
  );

  return buildPagination(rows, filters.page, filters.pageSize, countRows[0]?.total ?? 0);
};


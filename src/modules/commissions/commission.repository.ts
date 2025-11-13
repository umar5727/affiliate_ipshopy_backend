import { PoolConnection, ResultSetHeader } from 'mysql2/promise';
import { execute } from '../../config/database';
import { buildPagination, parsePagination } from '../../utils/pagination';
import { Commission, CreateCommissionInput, UpdateCommissionStatusInput } from './commission.types';

const baseSelect = `
  SELECT
    id,
    order_id AS orderId,
    affiliate_link_id AS affiliateLinkId,
    amount,
    status,
    confirmation_date AS confirmationDate,
    created_at AS createdAt
  FROM commissions
`;

export const listCommissions = async (query: Partial<Record<string, string>>) => {
  const { page, pageSize } = parsePagination(query);
  const where: string[] = [];
  const params: unknown[] = [];

  if (query.status) {
    where.push('status = ?');
    params.push(query.status);
  }
  if (query.orderId) {
    where.push('order_id = ?');
    params.push(Number(query.orderId));
  }
  if (query.userId) {
    where.push('order_id IN (SELECT id FROM orders WHERE user_id = ?)');
    params.push(Number(query.userId));
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const offset = (page - 1) * pageSize;

  const [rows] = await execute<Commission[]>(
    `${baseSelect} ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...params, pageSize, offset],
  );

  const [countRows] = await execute<Array<{ total: number }>>(
    `SELECT COUNT(*) AS total FROM commissions ${whereClause}`,
    params,
  );

  return buildPagination(rows, page, pageSize, countRows[0]?.total ?? 0);
};

export const updateCommissionStatus = async (id: number, payload: UpdateCommissionStatusInput): Promise<void> => {
  await execute(
    `
    UPDATE commissions
    SET status = ?, confirmation_date = ?, updated_at = NOW()
    WHERE id = ?
  `,
    [payload.status, payload.confirmationDate ?? null, id],
  );
};

export const createCommission = async (payload: CreateCommissionInput, connection?: PoolConnection): Promise<Commission> => {
  const [result] = await execute<ResultSetHeader>(
    `
    INSERT INTO commissions (order_id, affiliate_link_id, amount, status, confirmation_date)
    VALUES (?, ?, ?, ?, ?)
  `,
    [payload.orderId, payload.affiliateLinkId ?? null, payload.amount, payload.status ?? 'pending', payload.confirmationDate ?? null],
    connection,
  );

  const [rows] = await execute<Commission[]>(`${baseSelect} WHERE id = ?`, [result.insertId]);
  return rows[0];
};

export const findByOrderId = async (orderId: number): Promise<Commission | null> => {
  const [rows] = await execute<Commission[]>(`${baseSelect} WHERE order_id = ?`, [orderId]);
  return rows[0] ?? null;
};


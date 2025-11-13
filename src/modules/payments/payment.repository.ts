import { ResultSetHeader } from 'mysql2/promise';
import { execute } from '../../config/database';
import { buildPagination, parsePagination } from '../../utils/pagination';
import { CreatePaymentRequest, Payment, UpdatePaymentStatus } from './payment.types';

const baseSelect = `
  SELECT
    id,
    user_id AS userId,
    amount,
    status,
    payment_date AS paymentDate,
    admin_remarks AS adminRemarks,
    transaction_ref AS transactionRef,
    created_at AS createdAt,
    updated_at AS updatedAt
  FROM payments
`;

export const listPayments = async (query: Partial<Record<string, string>>) => {
  const { page, pageSize } = parsePagination(query);
  const where: string[] = [];
  const params: unknown[] = [];

  if (query.userId) {
    where.push('user_id = ?');
    params.push(Number(query.userId));
  }
  if (query.status) {
    where.push('status = ?');
    params.push(query.status);
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const offset = (page - 1) * pageSize;

  const [rows] = await execute<Payment[]>(
    `${baseSelect} ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...params, pageSize, offset],
  );

  const [countRows] = await execute<Array<{ total: number }>>(
    `SELECT COUNT(*) AS total FROM payments ${whereClause}`,
    params,
  );

  return buildPagination(rows, page, pageSize, countRows[0]?.total ?? 0);
};

export const createPaymentRequest = async (payload: CreatePaymentRequest): Promise<Payment> => {
  const [result] = await execute<ResultSetHeader>(
    `
    INSERT INTO payments (user_id, amount, status, admin_remarks)
    VALUES (?, ?, 'requested', ?)
  `,
    [payload.userId, payload.amount, payload.adminRemarks ?? null],
  );

  const [rows] = await execute<Payment[]>(`${baseSelect} WHERE id = ?`, [result.insertId]);
  return rows[0];
};

export const updatePayment = async (id: number, payload: UpdatePaymentStatus): Promise<Payment | null> => {
  const fields: string[] = ['status = ?'];
  const values: unknown[] = [payload.status];

  if (payload.paymentDate !== undefined) {
    fields.push('payment_date = ?');
    values.push(payload.paymentDate ?? null);
  }

  if (payload.transactionRef !== undefined) {
    fields.push('transaction_ref = ?');
    values.push(payload.transactionRef ?? null);
  }

  if (payload.adminRemarks !== undefined) {
    fields.push('admin_remarks = ?');
    values.push(payload.adminRemarks ?? null);
  }

  values.push(id);

  await execute(`UPDATE payments SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`, values);

  const [rows] = await execute<Payment[]>(`${baseSelect} WHERE id = ?`, [id]);
  return rows[0] ?? null;
};


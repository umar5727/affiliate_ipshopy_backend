import { ResultSetHeader } from 'mysql2/promise';
import { execute } from '../../config/database';
import { buildPagination, parsePagination } from '../../utils/pagination';
import { CreateLinkInput, AffiliateLink } from './link.types';

const baseSelect = `
  SELECT
    l.id,
    l.user_id AS userId,
    l.product_id AS productId,
    l.url,
    l.source,
    l.status,
    l.last_reviewed_at AS lastReviewedAt,
    l.admin_remarks AS adminRemarks,
    l.created_at AS createdAt,
    l.updated_at AS updatedAt,
    u.name AS userName
  FROM affiliate_links l
  LEFT JOIN users u ON u.id = l.user_id
`;

export const createLink = async (payload: CreateLinkInput): Promise<AffiliateLink> => {
  const [result] = await execute<ResultSetHeader>(
    `
    INSERT INTO affiliate_links (user_id, product_id, url, source)
    VALUES (?, ?, ?, ?)
  `,
    [payload.userId, payload.productId ?? null, payload.url, payload.source ?? null],
  );

  const [rows] = await execute<AffiliateLink[]>(`${baseSelect} WHERE l.id = ?`, [result.insertId]);
  return rows[0];
};

export const findById = async (id: number): Promise<AffiliateLink | null> => {
  const [rows] = await execute<AffiliateLink[]>(`${baseSelect} WHERE l.id = ? LIMIT 1`, [id]);
  return rows[0] ?? null;
};

export const listLinks = async (query: Partial<Record<string, string>>) => {
  const { page, pageSize } = parsePagination(query);
  const where: string[] = [];
  const params: unknown[] = [];

  if (query.userId) {
    where.push('l.user_id = ?');
    params.push(Number(query.userId));
  }

  if (query.status) {
    where.push('l.status = ?');
    params.push(query.status);
  }

  if (query.search) {
    where.push('(l.url LIKE ? OR l.source LIKE ? OR u.name LIKE ?)');
    params.push(`%${query.search}%`, `%${query.search}%`, `%${query.search}%`);
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const offset = (page - 1) * pageSize;

  const [rows] = await execute<AffiliateLink[]>(
    `${baseSelect} ${whereClause} ORDER BY l.created_at DESC LIMIT ? OFFSET ?`,
    [...params, pageSize, offset],
  );

  const [countRows] = await execute<Array<{ total: number }>>(`SELECT COUNT(*) AS total FROM affiliate_links l ${whereClause}`, params);

  return buildPagination(rows, page, pageSize, countRows[0]?.total ?? 0);
};

export const updateLinkStatus = async (
  id: number,
  payload: { status: 'approved' | 'rejected'; adminRemarks?: string | null },
): Promise<AffiliateLink | null> => {
  await execute(
    `
    UPDATE affiliate_links
    SET status = ?,
        admin_remarks = ?,
        last_reviewed_at = NOW(),
        updated_at = NOW()
    WHERE id = ?
  `,
    [payload.status, payload.adminRemarks ?? null, id],
  );

  const [rows] = await execute<AffiliateLink[]>(`${baseSelect} WHERE l.id = ?`, [id]);

  return rows[0] ?? null;
};

export const incrementVisit = async (linkId: number): Promise<void> => {
  await execute(
    `
    INSERT INTO link_metrics (affiliate_link_id, timeframe, clicks)
    VALUES (?, 'all_time', 1)
    ON DUPLICATE KEY UPDATE
      clicks = clicks + 1,
      updated_at = NOW()
  `,
    [linkId],
  );
};

export const incrementOrderAttribution = async (linkId: number, amount: number): Promise<void> => {
  await execute(
    `
    INSERT INTO link_metrics (affiliate_link_id, timeframe, orders, earnings)
    VALUES (?, 'all_time', 1, ?)
    ON DUPLICATE KEY UPDATE
      orders = orders + 1,
      earnings = earnings + VALUES(earnings),
      updated_at = NOW()
  `,
    [linkId, amount],
  );
};


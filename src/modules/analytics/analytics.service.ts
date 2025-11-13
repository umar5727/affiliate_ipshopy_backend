import { execute } from '../../config/database';
import { buildTrackingUrl } from '../links/link.helpers';

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
  trackingUrl: string;
  source: string | null;
  createdAt: Date;
  clicks: number;
  orders: number;
  earnings: number;
  status: 'pending' | 'approved' | 'rejected';
  adminRemarks: string | null;
}

export const getOverviewMetrics = async (userId?: number): Promise<OverviewMetrics> => {
  const params: unknown[] = [];
  const userFilter = userId ? 'WHERE user_id = ?' : '';
  if (userId) {
    params.push(userId);
  }

  const [orderRows] = await execute<Array<{ confirmedOrders: number; totalOrders: number }>>(
    `
    SELECT
      SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) AS confirmedOrders,
      COUNT(*) AS totalOrders
    FROM orders
    ${userFilter}
  `,
    params,
  );

  const [commissionRows] = await execute<
    Array<{
      pendingCommission: number;
      confirmedCommission: number;
    }>
  >(
    `
    SELECT
      COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) AS pendingCommission,
      COALESCE(SUM(CASE WHEN status = 'confirmed' THEN amount ELSE 0 END), 0) AS confirmedCommission
    FROM commissions
    WHERE order_id IN (SELECT id FROM orders ${userFilter})
  `,
    params,
  );

  const [paymentRows] = await execute<Array<{ paidOut: number }>>(
    `
    SELECT
      COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) AS paidOut
    FROM payments
    ${userFilter}
  `,
    params,
  );

  const clickParams: unknown[] = [];
  const clickFilter = userId ? 'WHERE affiliate_link_id IN (SELECT id FROM affiliate_links WHERE user_id = ?)' : '';
  if (userId) {
    clickParams.push(userId);
  }

  const [clickRows] = await execute<Array<{ lifetimeClicks: number }>>(
    `
    SELECT COALESCE(SUM(clicks), 0) AS lifetimeClicks
    FROM link_metrics
    ${clickFilter}
  `,
    clickParams,
  );

  const lifetimeClicks = Number(clickRows[0]?.lifetimeClicks ?? 0);

  const orderTotals = orderRows[0];
  const commissionTotals = commissionRows[0];
  const paymentsTotals = paymentRows[0];

  return {
    lifetimeClicks,
    confirmedOrders: Number(orderTotals?.confirmedOrders ?? 0),
    pendingCommission: Number(commissionTotals?.pendingCommission ?? 0),
    confirmedCommission: Number(commissionTotals?.confirmedCommission ?? 0),
    paidOut: Number(paymentsTotals?.paidOut ?? 0),
    withdrawableCommission: Number(commissionTotals?.confirmedCommission ?? 0) - Number(paymentsTotals?.paidOut ?? 0),
  };
};

export const getLinkPerformance = async (userId?: number): Promise<LinkPerformance[]> => {
  const params: unknown[] = [];
  const whereClause = userId ? 'WHERE l.user_id = ?' : '';
  if (userId) {
    params.push(userId);
  }

  const [rows] = await execute<LinkPerformance[]>(
    `
    SELECT
      l.id,
      l.url,
      l.source,
      l.created_at AS createdAt,
      l.status,
      l.admin_remarks AS adminRemarks,
      COALESCE(SUM(m.clicks), 0) AS clicks,
      COALESCE(SUM(m.orders), 0) AS orders,
      COALESCE(SUM(m.earnings), 0) AS earnings
    FROM affiliate_links l
    LEFT JOIN link_metrics m ON m.affiliate_link_id = l.id
    ${whereClause}
    GROUP BY l.id, l.url, l.source, l.created_at
    ORDER BY earnings DESC, l.created_at DESC
  `,
    params,
  );

  return rows.map((row) => ({
    ...row,
    trackingUrl: buildTrackingUrl(row.url, row.id),
    clicks: Number(row.clicks ?? 0),
    orders: Number(row.orders ?? 0),
    earnings: Number(row.earnings ?? 0),
    status: row.status as LinkPerformance['status'],
  }));
};


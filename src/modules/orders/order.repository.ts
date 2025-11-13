import { PoolConnection, ResultSetHeader } from 'mysql2/promise';
import { execute } from '../../config/database';
import { buildPagination } from '../../utils/pagination';
import { parsePagination } from '../../utils/pagination';
import { Order, OrderWithItems, RecordOrderInput } from './order.types';

const baseSelect = `
  SELECT
    id,
    order_id_opencart AS orderIdOpencart,
    user_id AS userId,
    status,
    total_amount AS totalAmount,
    order_date AS orderDate,
    created_at AS createdAt
  FROM orders
`;

export const listOrders = async (query: Partial<Record<string, string>>) => {
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

  const [rows] = await execute<Order[]>(
    `${baseSelect} ${whereClause} ORDER BY order_date DESC LIMIT ? OFFSET ?`,
    [...params, pageSize, offset],
  );

  const [countRows] = await execute<Array<{ total: number }>>(
    `SELECT COUNT(*) AS total FROM orders ${whereClause}`,
    params,
  );

  return buildPagination(rows, page, pageSize, countRows[0]?.total ?? 0);
};

export const findByOpenCartId = async (orderIdOpencart: number): Promise<Order | null> => {
  const [rows] = await execute<Order[] & { length: number }>(`${baseSelect} WHERE order_id_opencart = ?`, [orderIdOpencart]);
  return rows[0] ?? null;
};

export const getOrderWithItems = async (id: number): Promise<OrderWithItems | null> => {
  const [orderRows] = await execute<Order[]>(`${baseSelect} WHERE id = ?`, [id]);
  const order = orderRows[0];
  if (!order) {
    return null;
  }

  const [itemRows] = await execute<
    Array<{
      id: number;
      productId: number;
      quantity: number;
      price: number;
    }>
  >(
    `
    SELECT
      id,
      product_id AS productId,
      quantity,
      price
    FROM order_items
    WHERE order_id = ?
  `,
    [id],
  );

  return { ...order, items: itemRows };
};

export const recordOrder = async (input: RecordOrderInput, connection?: PoolConnection): Promise<OrderWithItems> => {
  const [result] = await execute<ResultSetHeader>(
    `
    INSERT INTO orders (order_id_opencart, user_id, status, total_amount, order_date)
    VALUES (?, ?, ?, ?, ?)
  `,
    [input.orderIdOpencart, input.userId, input.status, input.totalAmount, input.orderDate],
    connection,
  );

  const orderId = result.insertId;

  if (input.items.length) {
    const values = input.items.map((item) => [orderId, item.productId, item.quantity, item.price]);
    await execute(
      `
      INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES ${values.map(() => '(?, ?, ?, ?)').join(', ')}
    `,
      values.flat(),
      connection,
    );
  }

  const order = await getOrderWithItems(orderId);
  if (!order) {
    throw new Error('Failed to record order');
  }
  return order;
};

export const updateOrderStatus = async (id: number, status: string, connection?: PoolConnection): Promise<void> => {
  await execute('UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?', [status, id], connection);
};


"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.recordOrder = exports.getOrderWithItems = exports.findByOpenCartId = exports.listOrders = void 0;
const database_1 = require("../../config/database");
const pagination_1 = require("../../utils/pagination");
const pagination_2 = require("../../utils/pagination");
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
const listOrders = async (query) => {
    const { page, pageSize } = (0, pagination_2.parsePagination)(query);
    const where = [];
    const params = [];
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
    const [rows] = await (0, database_1.execute)(`${baseSelect} ${whereClause} ORDER BY order_date DESC LIMIT ? OFFSET ?`, [...params, pageSize, offset]);
    const [countRows] = await (0, database_1.execute)(`SELECT COUNT(*) AS total FROM orders ${whereClause}`, params);
    return (0, pagination_1.buildPagination)(rows, page, pageSize, countRows[0]?.total ?? 0);
};
exports.listOrders = listOrders;
const findByOpenCartId = async (orderIdOpencart) => {
    const [rows] = await (0, database_1.execute)(`${baseSelect} WHERE order_id_opencart = ?`, [orderIdOpencart]);
    return rows[0] ?? null;
};
exports.findByOpenCartId = findByOpenCartId;
const getOrderWithItems = async (id) => {
    const [orderRows] = await (0, database_1.execute)(`${baseSelect} WHERE id = ?`, [id]);
    const order = orderRows[0];
    if (!order) {
        return null;
    }
    const [itemRows] = await (0, database_1.execute)(`
    SELECT
      id,
      product_id AS productId,
      quantity,
      price
    FROM order_items
    WHERE order_id = ?
  `, [id]);
    return { ...order, items: itemRows };
};
exports.getOrderWithItems = getOrderWithItems;
const recordOrder = async (input, connection) => {
    const [result] = await (0, database_1.execute)(`
    INSERT INTO orders (order_id_opencart, user_id, status, total_amount, order_date)
    VALUES (?, ?, ?, ?, ?)
  `, [input.orderIdOpencart, input.userId, input.status, input.totalAmount, input.orderDate], connection);
    const orderId = result.insertId;
    if (input.items.length) {
        const values = input.items.map((item) => [orderId, item.productId, item.quantity, item.price]);
        await (0, database_1.execute)(`
      INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES ${values.map(() => '(?, ?, ?, ?)').join(', ')}
    `, values.flat(), connection);
    }
    const order = await (0, exports.getOrderWithItems)(orderId);
    if (!order) {
        throw new Error('Failed to record order');
    }
    return order;
};
exports.recordOrder = recordOrder;
const updateOrderStatus = async (id, status, connection) => {
    await (0, database_1.execute)('UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?', [status, id], connection);
};
exports.updateOrderStatus = updateOrderStatus;
//# sourceMappingURL=order.repository.js.map
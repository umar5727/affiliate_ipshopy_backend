"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByOrderId = exports.createCommission = exports.updateCommissionStatus = exports.listCommissions = void 0;
const database_1 = require("../../config/database");
const pagination_1 = require("../../utils/pagination");
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
const listCommissions = async (query) => {
    const { page, pageSize } = (0, pagination_1.parsePagination)(query);
    const where = [];
    const params = [];
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
    const [rows] = await (0, database_1.execute)(`${baseSelect} ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, pageSize, offset]);
    const [countRows] = await (0, database_1.execute)(`SELECT COUNT(*) AS total FROM commissions ${whereClause}`, params);
    return (0, pagination_1.buildPagination)(rows, page, pageSize, countRows[0]?.total ?? 0);
};
exports.listCommissions = listCommissions;
const updateCommissionStatus = async (id, payload) => {
    await (0, database_1.execute)(`
    UPDATE commissions
    SET status = ?, confirmation_date = ?, updated_at = NOW()
    WHERE id = ?
  `, [payload.status, payload.confirmationDate ?? null, id]);
};
exports.updateCommissionStatus = updateCommissionStatus;
const createCommission = async (payload, connection) => {
    const [result] = await (0, database_1.execute)(`
    INSERT INTO commissions (order_id, affiliate_link_id, amount, status, confirmation_date)
    VALUES (?, ?, ?, ?, ?)
  `, [payload.orderId, payload.affiliateLinkId ?? null, payload.amount, payload.status ?? 'pending', payload.confirmationDate ?? null], connection);
    const [rows] = await (0, database_1.execute)(`${baseSelect} WHERE id = ?`, [result.insertId]);
    return rows[0];
};
exports.createCommission = createCommission;
const findByOrderId = async (orderId) => {
    const [rows] = await (0, database_1.execute)(`${baseSelect} WHERE order_id = ?`, [orderId]);
    return rows[0] ?? null;
};
exports.findByOrderId = findByOrderId;
//# sourceMappingURL=commission.repository.js.map
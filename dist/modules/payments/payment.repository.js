"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePayment = exports.createPaymentRequest = exports.listPayments = void 0;
const database_1 = require("../../config/database");
const pagination_1 = require("../../utils/pagination");
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
const listPayments = async (query) => {
    const { page, pageSize } = (0, pagination_1.parsePagination)(query);
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
    const [rows] = await (0, database_1.execute)(`${baseSelect} ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, pageSize, offset]);
    const [countRows] = await (0, database_1.execute)(`SELECT COUNT(*) AS total FROM payments ${whereClause}`, params);
    return (0, pagination_1.buildPagination)(rows, page, pageSize, countRows[0]?.total ?? 0);
};
exports.listPayments = listPayments;
const createPaymentRequest = async (payload) => {
    const [result] = await (0, database_1.execute)(`
    INSERT INTO payments (user_id, amount, status, admin_remarks)
    VALUES (?, ?, 'requested', ?)
  `, [payload.userId, payload.amount, payload.adminRemarks ?? null]);
    const [rows] = await (0, database_1.execute)(`${baseSelect} WHERE id = ?`, [result.insertId]);
    return rows[0];
};
exports.createPaymentRequest = createPaymentRequest;
const updatePayment = async (id, payload) => {
    const fields = ['status = ?'];
    const values = [payload.status];
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
    await (0, database_1.execute)(`UPDATE payments SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`, values);
    const [rows] = await (0, database_1.execute)(`${baseSelect} WHERE id = ?`, [id]);
    return rows[0] ?? null;
};
exports.updatePayment = updatePayment;
//# sourceMappingURL=payment.repository.js.map
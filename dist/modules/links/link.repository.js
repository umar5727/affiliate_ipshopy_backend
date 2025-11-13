"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLinkStatus = exports.listLinks = exports.createLink = void 0;
const database_1 = require("../../config/database");
const pagination_1 = require("../../utils/pagination");
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
const createLink = async (payload) => {
    const [result] = await (0, database_1.execute)(`
    INSERT INTO affiliate_links (user_id, product_id, url, source)
    VALUES (?, ?, ?, ?)
  `, [payload.userId, payload.productId ?? null, payload.url, payload.source ?? null]);
    const [rows] = await (0, database_1.execute)(`${baseSelect} WHERE l.id = ?`, [result.insertId]);
    return rows[0];
};
exports.createLink = createLink;
const listLinks = async (query) => {
    const { page, pageSize } = (0, pagination_1.parsePagination)(query);
    const where = [];
    const params = [];
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
    const [rows] = await (0, database_1.execute)(`${baseSelect} ${whereClause} ORDER BY l.created_at DESC LIMIT ? OFFSET ?`, [...params, pageSize, offset]);
    const [countRows] = await (0, database_1.execute)(`SELECT COUNT(*) AS total FROM affiliate_links l ${whereClause}`, params);
    return (0, pagination_1.buildPagination)(rows, page, pageSize, countRows[0]?.total ?? 0);
};
exports.listLinks = listLinks;
const updateLinkStatus = async (id, payload) => {
    await (0, database_1.execute)(`
    UPDATE affiliate_links
    SET status = ?,
        admin_remarks = ?,
        last_reviewed_at = NOW(),
        updated_at = NOW()
    WHERE id = ?
  `, [payload.status, payload.adminRemarks ?? null, id]);
    const [rows] = await (0, database_1.execute)(`${baseSelect} WHERE l.id = ?`, [id]);
    return rows[0] ?? null;
};
exports.updateLinkStatus = updateLinkStatus;
//# sourceMappingURL=link.repository.js.map
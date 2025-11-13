"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAffiliates = exports.updateAffiliate = exports.createAffiliate = exports.findById = exports.findByMobile = void 0;
const database_1 = require("../../config/database");
const pagination_1 = require("../../utils/pagination");
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
const findByMobile = async (mobileNumber) => {
    const [rows] = await (0, database_1.execute)(`${baseSelect} WHERE mobile_number = ? LIMIT 1`, [mobileNumber]);
    return rows[0] ?? null;
};
exports.findByMobile = findByMobile;
const findById = async (id, connection) => {
    const [rows] = await (0, database_1.execute)(`${baseSelect} WHERE id = ? LIMIT 1`, [id], connection);
    return rows[0] ?? null;
};
exports.findById = findById;
const createAffiliate = async (input, connection) => {
    const [result] = await (0, database_1.execute)(`
    INSERT INTO users (name, mobile_number, whatsapp_verified, role, channel_link, app_link, website_link, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
        input.name,
        input.mobileNumber,
        0,
        input.role ?? 'affiliate',
        input.channelLink ?? null,
        input.appLink ?? null,
        input.websiteLink ?? null,
        input.status ?? 'pending',
    ], connection);
    const created = await (0, exports.findById)(result.insertId, connection);
    if (!created) {
        throw new Error('Failed to create affiliate');
    }
    return created;
};
exports.createAffiliate = createAffiliate;
const updateAffiliate = async (id, input, connection) => {
    const fields = [];
    const values = [];
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
        return (0, exports.findById)(id);
    }
    values.push(id);
    await (0, database_1.execute)(`UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`, values, connection);
    return (0, exports.findById)(id, connection);
};
exports.updateAffiliate = updateAffiliate;
const listAffiliates = async (filters) => {
    const where = [];
    const params = [];
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
    const [rows] = await (0, database_1.execute)(`${baseSelect} ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, filters.pageSize, offset]);
    const [countRows] = await (0, database_1.execute)(`SELECT COUNT(*) AS total FROM users ${whereClause}`, params);
    return (0, pagination_1.buildPagination)(rows, filters.page, filters.pageSize, countRows[0]?.total ?? 0);
};
exports.listAffiliates = listAffiliates;
//# sourceMappingURL=affiliate.repository.js.map
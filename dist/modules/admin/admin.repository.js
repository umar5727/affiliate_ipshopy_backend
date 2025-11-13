"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findRefreshToken = exports.revokeRefreshToken = exports.storeRefreshToken = exports.markWhatsAppVerified = exports.findById = exports.findByMobile = void 0;
const database_1 = require("../../config/database");
const findByMobile = async (mobileNumber) => {
    const [rows] = await (0, database_1.execute)(`
    SELECT
      id,
      name,
      mobile_number AS mobileNumber,
      status,
      whatsapp_verified AS whatsappVerified,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM admin_users
    WHERE mobile_number = ?
    LIMIT 1
  `, [mobileNumber]);
    return rows[0] ?? null;
};
exports.findByMobile = findByMobile;
const findById = async (adminId) => {
    const [rows] = await (0, database_1.execute)(`
    SELECT
      id,
      name,
      mobile_number AS mobileNumber,
      status,
      whatsapp_verified AS whatsappVerified,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM admin_users
    WHERE id = ?
    LIMIT 1
  `, [adminId]);
    return rows[0] ?? null;
};
exports.findById = findById;
const markWhatsAppVerified = async (adminId) => {
    await (0, database_1.execute)('UPDATE admin_users SET whatsapp_verified = 1, updated_at = NOW() WHERE id = ?', [adminId]);
};
exports.markWhatsAppVerified = markWhatsAppVerified;
const storeRefreshToken = async (adminId, tokenId, expiresInDays) => {
    await (0, database_1.execute)(`
    INSERT INTO admin_refresh_tokens (admin_user_id, token_id, expires_at)
    VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? DAY))
  `, [adminId, tokenId, expiresInDays]);
};
exports.storeRefreshToken = storeRefreshToken;
const revokeRefreshToken = async (tokenId) => {
    await (0, database_1.execute)('DELETE FROM admin_refresh_tokens WHERE token_id = ?', [tokenId]);
};
exports.revokeRefreshToken = revokeRefreshToken;
const findRefreshToken = async (tokenId) => {
    const [rows] = await (0, database_1.execute)(`
    SELECT admin_user_id AS adminUserId, expires_at AS expiresAt
    FROM admin_refresh_tokens
    WHERE token_id = ?
  `, [tokenId]);
    return rows[0] ?? null;
};
exports.findRefreshToken = findRefreshToken;
//# sourceMappingURL=admin.repository.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markRead = exports.listNotifications = exports.createNotification = void 0;
const database_1 = require("../../config/database");
const baseSelect = `
  SELECT
    id,
    user_id AS userId,
    title,
    body,
    type,
    read_at AS readAt,
    created_at AS createdAt
  FROM notifications
`;
const createNotification = async (payload) => {
    const [result] = await (0, database_1.execute)(`
    INSERT INTO notifications (user_id, title, body, type)
    VALUES (?, ?, ?, ?)
  `, [payload.userId, payload.title, payload.body, payload.type ?? 'info']);
    const [rows] = await (0, database_1.execute)(`${baseSelect} WHERE id = ?`, [result.insertId]);
    return rows[0];
};
exports.createNotification = createNotification;
const listNotifications = async (userId) => {
    const [rows] = await (0, database_1.execute)(`${baseSelect} WHERE user_id = ? ORDER BY created_at DESC LIMIT 20`, [userId]);
    return rows;
};
exports.listNotifications = listNotifications;
const markRead = async (id, userId) => {
    await (0, database_1.execute)('UPDATE notifications SET read_at = NOW() WHERE id = ? AND user_id = ?', [id, userId]);
};
exports.markRead = markRead;
//# sourceMappingURL=notification.repository.js.map
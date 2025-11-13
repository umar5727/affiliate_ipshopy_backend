import { ResultSetHeader } from 'mysql2/promise';
import { execute } from '../../config/database';
import { Notification, CreateNotificationInput } from './notification.types';

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

export const createNotification = async (payload: CreateNotificationInput): Promise<Notification> => {
  const [result] = await execute<ResultSetHeader>(
    `
    INSERT INTO notifications (user_id, title, body, type)
    VALUES (?, ?, ?, ?)
  `,
    [payload.userId, payload.title, payload.body, payload.type ?? 'info'],
  );

  const [rows] = await execute<Notification[]>(`${baseSelect} WHERE id = ?`, [result.insertId]);
  return rows[0];
};

export const listNotifications = async (userId: number): Promise<Notification[]> => {
  const [rows] = await execute<Notification[]>(`${baseSelect} WHERE user_id = ? ORDER BY created_at DESC LIMIT 20`, [userId]);
  return rows;
};

export const markRead = async (id: number, userId: number): Promise<void> => {
  await execute('UPDATE notifications SET read_at = NOW() WHERE id = ? AND user_id = ?', [id, userId]);
};

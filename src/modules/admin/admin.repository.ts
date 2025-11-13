import { execute } from '../../config/database';
import { AdminUser } from './admin.types';

export const findByMobile = async (mobileNumber: string): Promise<AdminUser | null> => {
  const [rows] = await execute<AdminUser[]>(
    `
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
  `,
    [mobileNumber],
  );

  return rows[0] ?? null;
};

export const findById = async (adminId: number): Promise<AdminUser | null> => {
  const [rows] = await execute<AdminUser[]>(
    `
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
  `,
    [adminId],
  );

  return rows[0] ?? null;
};

export const markWhatsAppVerified = async (adminId: number): Promise<void> => {
  await execute('UPDATE admin_users SET whatsapp_verified = 1, updated_at = NOW() WHERE id = ?', [adminId]);
};

export const storeRefreshToken = async (
  adminId: number,
  tokenId: string,
  expiresInDays: number,
): Promise<void> => {
  await execute(
    `
    INSERT INTO admin_refresh_tokens (admin_user_id, token_id, expires_at)
    VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? DAY))
  `,
    [adminId, tokenId, expiresInDays],
  );
};

export const revokeRefreshToken = async (tokenId: string): Promise<void> => {
  await execute('DELETE FROM admin_refresh_tokens WHERE token_id = ?', [tokenId]);
};

export const findRefreshToken = async (
  tokenId: string,
): Promise<{ adminUserId: number; expiresAt: Date } | null> => {
  const [rows] = await execute<Array<{ adminUserId: number; expiresAt: Date }>>(
    `
    SELECT admin_user_id AS adminUserId, expires_at AS expiresAt
    FROM admin_refresh_tokens
    WHERE token_id = ?
  `,
    [tokenId],
  );

  return rows[0] ?? null;
};


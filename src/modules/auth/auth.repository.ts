import { PoolConnection } from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { execute } from '../../config/database';
import { Affiliate } from '../affiliates/affiliate.types';
import * as affiliateRepository from '../affiliates/affiliate.repository';

interface OtpRecord {
  id: number;
  mobileNumber: string;
  otpHash: string;
  expiresAt: Date;
  attempts: number;
}

export const upsertOtp = async (mobileNumber: string, otp: string, ttlMinutes: number): Promise<void> => {
  const hash = await bcrypt.hash(otp, 10);
  await execute(
    `
    INSERT INTO otp_tokens (mobile_number, otp_hash, expires_at, attempts)
    VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? MINUTE), 0)
    ON DUPLICATE KEY UPDATE
      otp_hash = VALUES(otp_hash),
      expires_at = VALUES(expires_at),
      attempts = 0,
      updated_at = NOW()
  `,
    [mobileNumber, hash, ttlMinutes],
  );
};

export const validateOtp = async (mobileNumber: string, otp: string): Promise<boolean> => {
  const [rows] = await execute<OtpRecord[]>(
    `
    SELECT id, mobile_number AS mobileNumber, otp_hash AS otpHash, expires_at AS expiresAt, attempts
    FROM otp_tokens
    WHERE mobile_number = ?
    `,
    [mobileNumber],
  );

  const record = rows[0];
  if (!record) {
    return false;
  }
  if (record.expiresAt < new Date()) {
    await execute('DELETE FROM otp_tokens WHERE id = ?', [record.id]);
    return false;
  }

  const isMatch = await bcrypt.compare(otp, record.otpHash);
  await execute('UPDATE otp_tokens SET attempts = attempts + 1, updated_at = NOW() WHERE id = ?', [record.id]);

  if (!isMatch) {
    return false;
  }

  await execute('DELETE FROM otp_tokens WHERE id = ?', [record.id]);
  return true;
};

export const findUserByMobile = affiliateRepository.findByMobile;

export const createAffiliate = affiliateRepository.createAffiliate;

export const markWhatsAppVerified = async (userId: number, connection?: PoolConnection): Promise<void> => {
  await execute('UPDATE users SET whatsapp_verified = 1, updated_at = NOW() WHERE id = ?', [userId], connection);
};

export const storeRefreshToken = async (
  userId: number,
  tokenId: string,
  expiresInDays: number,
  connection?: PoolConnection,
): Promise<void> => {
  await execute(
    `
    INSERT INTO refresh_tokens (user_id, token_id, expires_at)
    VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? DAY))
  `,
    [userId, tokenId, expiresInDays],
    connection,
  );
};

export const revokeRefreshToken = async (tokenId: string): Promise<void> => {
  await execute('DELETE FROM refresh_tokens WHERE token_id = ?', [tokenId]);
};

export const findRefreshToken = async (tokenId: string): Promise<{ userId: number; expiresAt: Date } | null> => {
  const [rows] = await execute<Array<{ userId: number; expiresAt: Date }>>(
    `
    SELECT user_id AS userId, expires_at AS expiresAt
    FROM refresh_tokens
    WHERE token_id = ?
    `,
    [tokenId],
  );
  return rows[0] ?? null;
};


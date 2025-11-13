import { v4 as uuidv4 } from 'uuid';
import { env } from '../../config/env';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { AuthenticatedUser } from '../../types';
import * as adminRepository from './admin.repository';
import * as authRepository from '../auth/auth.repository';
import { sendOtpViaInterakt } from '../auth/otp.provider';

const ADMIN_OTP_TTL_MINUTES = 5;

const toAuthenticatedAdmin = (admin: Awaited<ReturnType<typeof adminRepository.findByMobile>>): AuthenticatedUser => {
  if (!admin) {
    throw new Error('Admin not found');
  }

  return {
    id: admin.id,
    name: admin.name,
    mobileNumber: admin.mobileNumber,
    role: 'admin',
    status: admin.status,
  };
};

export const requestOtp = async (mobileNumber: string) => {
  const admin = await adminRepository.findByMobile(mobileNumber);
  if (!admin || admin.status !== 'active') {
    throw new Error('Admin account not found or suspended');
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await authRepository.upsertOtp(mobileNumber, otp, ADMIN_OTP_TTL_MINUTES);

  if (env.otp.provider === 'interakt') {
    await sendOtpViaInterakt(mobileNumber, otp);
  }

  return otp;
};

export const verifyOtp = async (mobileNumber: string, otp: string) => {
  const admin = await adminRepository.findByMobile(mobileNumber);
  if (!admin || admin.status !== 'active') {
    throw new Error('Admin account not found or suspended');
  }

  const isValid = await authRepository.validateOtp(mobileNumber, otp);
  if (!isValid) {
    throw new Error('Invalid or expired OTP');
  }

  await adminRepository.markWhatsAppVerified(admin.id);

  const authAdmin = toAuthenticatedAdmin(admin);
  const tokenId = uuidv4();

  await adminRepository.storeRefreshToken(admin.id, tokenId, env.jwt.refreshTtlDays);

  return {
    admin: authAdmin,
    tokens: {
      accessToken: signAccessToken(authAdmin),
      refreshToken: signRefreshToken(admin.id, tokenId),
      expiresIn: env.jwt.accessTtlMinutes * 60,
    },
  };
};

export const refreshTokens = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken);
  const stored = await adminRepository.findRefreshToken(payload.tokenId);

  if (!stored || stored.adminUserId !== payload.sub || stored.expiresAt < new Date()) {
    throw new Error('Refresh token expired');
  }

  await adminRepository.revokeRefreshToken(payload.tokenId);

  const admin = await adminRepository.findById(stored.adminUserId);
  if (!admin) {
    throw new Error('Admin account not found');
  }

  const authAdmin = toAuthenticatedAdmin(admin);
  const tokenId = uuidv4();

  await adminRepository.storeRefreshToken(admin.id, tokenId, env.jwt.refreshTtlDays);

  return {
    admin: authAdmin,
    tokens: {
      accessToken: signAccessToken(authAdmin),
      refreshToken: signRefreshToken(admin.id, tokenId),
      expiresIn: env.jwt.accessTtlMinutes * 60,
    },
  };
};


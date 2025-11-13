import { v4 as uuidv4 } from 'uuid';
import { withTransaction } from '../../config/database';
import { env } from '../../config/env';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { AuthenticatedUser } from '../../types';
import * as authRepository from './auth.repository';
import * as affiliateRepository from '../affiliates/affiliate.repository';
import { CreateAffiliateInput } from '../affiliates/affiliate.types';
import { OtpVerifyPayload } from '.';
import { sendOtpViaInterakt } from './otp.provider';

const OTP_TTL_MINUTES = 5;

const toAuthenticatedUser = async (userId: number): Promise<AuthenticatedUser> => {
  const user = await affiliateRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return {
    id: user.id,
    name: user.name,
    mobileNumber: user.mobileNumber,
    role: user.role,
    status: user.status,
  };
};

export const requestOtp = async (mobileNumber: string) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await authRepository.upsertOtp(mobileNumber, otp, OTP_TTL_MINUTES);
  console.log('requestOtp', mobileNumber, otp);
  if (env.otp.provider === 'interakt') {
    await sendOtpViaInterakt(mobileNumber, otp);
  }
  return otp;
};

export const verifyOtp = async (payload: OtpVerifyPayload) => {
  const isValid = await authRepository.validateOtp(payload.mobileNumber, payload.otp);
  if (!isValid) {
    throw new Error('Invalid or expired OTP');
  }

  const { user, isNew } = await withTransaction(async (connection) => {
    const existing = await authRepository.findUserByMobile(payload.mobileNumber);
    if (existing) {
      await authRepository.markWhatsAppVerified(existing.id, connection);
      return { user: existing, isNew: false };
    }

    const derivedName =
      payload.name && payload.name.trim().length > 1
        ? payload.name.trim()
        : `Creator ${payload.mobileNumber.slice(-4)}`;
    const affiliatePayload: CreateAffiliateInput = {
      name: derivedName,
      mobileNumber: payload.mobileNumber,
      channelLink: payload.channelLink ?? null,
      appLink: payload.appLink ?? null,
      websiteLink: payload.websiteLink ?? null,
      role: 'affiliate',
      status: 'pending',
    };

    const created = await authRepository.createAffiliate(affiliatePayload, connection);
    await authRepository.markWhatsAppVerified(created.id, connection);
    return { user: created, isNew: true };
  });

  const authUser = await toAuthenticatedUser(user.id);
  const tokenId = uuidv4();

  await authRepository.storeRefreshToken(user.id, tokenId, env.jwt.refreshTtlDays);

  return {
    isNew,
    user: authUser,
    tokens: {
      accessToken: signAccessToken(authUser),
      refreshToken: signRefreshToken(user.id, tokenId),
      expiresIn: env.jwt.accessTtlMinutes * 60,
    },
  };
};

export const refreshTokens = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken);
  const stored = await authRepository.findRefreshToken(payload.tokenId);
  if (!stored || stored.userId !== payload.sub || stored.expiresAt < new Date()) {
    throw new Error('Refresh token expired');
  }

  await authRepository.revokeRefreshToken(payload.tokenId);

  const user = await toAuthenticatedUser(stored.userId);
  const tokenId = uuidv4();

  await authRepository.storeRefreshToken(user.id, tokenId, env.jwt.refreshTtlDays);

  return {
    accessToken: signAccessToken(user),
    refreshToken: signRefreshToken(user.id, tokenId),
    expiresIn: env.jwt.accessTtlMinutes * 60,
  };
};


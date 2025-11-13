import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthenticatedUser } from '../types';

interface AccessTokenPayload {
  sub: number;
  role: string;
  name: string;
  mobileNumber: string;
  status: string;
}

interface RefreshTokenPayload {
  sub: number;
  tokenId: string;
}

export const signAccessToken = (user: AuthenticatedUser): string => {
  const payload: AccessTokenPayload = {
    sub: user.id,
    role: user.role,
    name: user.name,
    mobileNumber: user.mobileNumber,
    status: user.status,
  };
  return jwt.sign(payload, env.jwt.accessSecret, { expiresIn: `${env.jwt.accessTtlMinutes}m` });
};

export const signRefreshToken = (userId: number, tokenId: string): string => {
  const payload: RefreshTokenPayload = {
    sub: userId,
    tokenId,
  };
  return jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: `${env.jwt.refreshTtlDays}d` });
};

const assertPayload = <T>(decoded: string | JwtPayload): T => {
  if (typeof decoded === 'string') {
    throw new Error('Invalid token payload');
  }
  return decoded as unknown as T;
};

export const verifyAccessToken = (token: string): AuthenticatedUser => {
  const decoded = assertPayload<AccessTokenPayload>(jwt.verify(token, env.jwt.accessSecret));
  return {
    id: decoded.sub,
    role: decoded.role as AuthenticatedUser['role'],
    name: decoded.name,
    mobileNumber: decoded.mobileNumber,
    status: decoded.status as AuthenticatedUser['status'],
  };
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return assertPayload<RefreshTokenPayload>(jwt.verify(token, env.jwt.refreshSecret));
};


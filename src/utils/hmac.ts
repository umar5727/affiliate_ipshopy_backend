import crypto from 'crypto';

export const generateSignature = (payload: unknown, secret: string): string => {
  const body = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return crypto.createHmac('sha256', secret).update(body).digest('hex');
};

export const verifySignature = (payload: unknown, secret: string, signature: string): boolean => {
  const expected = generateSignature(payload, secret);
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
};


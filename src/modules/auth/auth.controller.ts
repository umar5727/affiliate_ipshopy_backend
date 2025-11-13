import { Request, Response } from 'express';
import * as authService from './auth.service';

export const requestOtp = async (req: Request, res: Response) => {
  try {
    const otp = await authService.requestOtp(req.body.mobileNumber);
console.log('Generated OTP:', otp);
    res.json({
      success: true,
      message: 'OTP generated successfully',
      // Note: In production the OTP should be sent via WhatsApp/SMS provider.
      debug: process.env.NODE_ENV !== 'production' ? { otp } : undefined,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const result = await authService.verifyOtp(req.body);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const tokens = await authService.refreshTokens(req.body.refreshToken);
    res.json({ success: true, tokens });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};


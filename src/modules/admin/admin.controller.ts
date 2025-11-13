import { Request, Response } from 'express';
import * as adminService from './admin.service';

export const requestOtp = async (req: Request, res: Response) => {
  try {
    await adminService.requestOtp(req.body.mobileNumber);
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const result = await adminService.verifyOtp(req.body.mobileNumber, req.body.otp);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const result = await adminService.refreshTokens(req.body.refreshToken);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

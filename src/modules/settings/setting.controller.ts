import { Request, Response } from 'express';
import * as settingService from './setting.service';

export const listSettings = async (_req: Request, res: Response) => {
  const settings = await settingService.listSettings();
  res.json({ success: true, data: settings });
};

export const updateSetting = async (req: Request, res: Response) => {
  const setting = await settingService.updateSetting(req.body.key, String(req.body.value), req.body.description ?? null);
  res.json({ success: true, data: setting });
};

export const getCreatorSettings = async (_req: Request, res: Response) => {
  const keys = ['video_login_url', 'video_home_url', 'video_payments_url', 'payout_minimum_threshold', 'payout_window_days'];
  const settings = await settingService.getSettings(keys);
  res.json({ success: true, data: settings });
};


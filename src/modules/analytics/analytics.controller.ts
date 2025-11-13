import { Request, Response } from 'express';
import * as analyticsService from './analytics.service';

export const getOverview = async (req: Request, res: Response) => {
  const metrics = await analyticsService.getOverviewMetrics(req.user?.role === 'affiliate' ? req.user.id : undefined);
  res.json({ success: true, data: metrics });
};

export const getLinkPerformance = async (req: Request, res: Response) => {
  const links = await analyticsService.getLinkPerformance(req.user?.role === 'affiliate' ? req.user.id : undefined);
  res.json({ success: true, data: links });
};


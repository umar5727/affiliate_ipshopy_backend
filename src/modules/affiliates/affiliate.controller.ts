import { Request, Response } from 'express';
import * as affiliateService from './affiliate.service';

export const listAffiliates = async (req: Request, res: Response) => {
  const result = await affiliateService.listAffiliates(req.query as Record<string, string>);
  res.json({ success: true, ...result });
};

export const getAffiliate = async (req: Request, res: Response) => {
  const affiliate = await affiliateService.getAffiliateById(Number(req.params.id));
  if (!affiliate) {
    return res.status(404).json({ success: false, message: 'Affiliate not found' });
  }
  return res.json({ success: true, data: affiliate });
};

export const createAffiliate = async (req: Request, res: Response) => {
  const affiliate = await affiliateService.createAffiliate(req.body);
  res.status(201).json({ success: true, data: affiliate });
};

export const updateAffiliate = async (req: Request, res: Response) => {
  const affiliate = await affiliateService.updateAffiliate(Number(req.params.id), req.body);
  if (!affiliate) {
    return res.status(404).json({ success: false, message: 'Affiliate not found' });
  }
  return res.json({ success: true, data: affiliate });
};


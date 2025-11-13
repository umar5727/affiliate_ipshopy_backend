import { Request, Response } from 'express';
import * as linkService from './link.service';
import * as affiliateRepository from '../affiliates/affiliate.repository';

export const listLinks = async (req: Request, res: Response) => {
  const query: Record<string, string> = { ...(req.query as Record<string, string>) };
  if (req.user?.role === 'affiliate') {
    query.userId = String(req.user.id);
  }
  const result = await linkService.listLinks(query);
  res.json({ success: true, ...result });
};

export const createLink = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const link = await linkService.createLink({
    userId: req.user.id,
    url: req.body.url,
    source: req.body.source,
    productId: req.body.productId,
    name: req.body.name,
    channelLink: req.body.channelLink,
    appLink: req.body.appLink,
    websiteLink: req.body.websiteLink,
  });

  const profile = await affiliateRepository.findById(req.user.id);

  return res.status(201).json({ success: true, data: link, profile });
};

export const updateLinkStatus = async (req: Request, res: Response) => {
  const updated = await linkService.updateLinkStatus(Number(req.params.id), req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Link not found' });
  }
  return res.json({ success: true, data: updated });
};


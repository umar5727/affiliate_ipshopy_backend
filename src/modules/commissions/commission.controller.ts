import { Request, Response } from 'express';
import * as commissionService from './commission.service';

export const listCommissions = async (req: Request, res: Response) => {
  const result = await commissionService.listCommissions(req.query as Record<string, string>);
  res.json({ success: true, ...result });
};

export const updateCommission = async (req: Request, res: Response) => {
  await commissionService.updateCommissionStatus(Number(req.params.id), {
    status: req.body.status,
    confirmationDate: req.body.confirmationDate ? new Date(req.body.confirmationDate) : null,
  });
  res.json({ success: true });
};


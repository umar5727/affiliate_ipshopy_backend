import { Request, Response } from 'express';
import * as paymentService from './payment.service';

export const listPayments = async (req: Request, res: Response) => {
  const query: Record<string, string> = { ...(req.query as Record<string, string>) };

  if (req.user?.role === 'affiliate') {
    query.userId = String(req.user.id);
  }

  const result = await paymentService.listPayments(query);
  res.json({ success: true, ...result });
};

export const createPayment = async (req: Request, res: Response) => {
  const payment = await paymentService.createPaymentRequest(req.body);
  res.status(201).json({ success: true, data: payment });
};

export const updatePayment = async (req: Request, res: Response) => {
  const payment = await paymentService.updatePayment(Number(req.params.id), {
    ...req.body,
    paymentDate: req.body.paymentDate ? new Date(req.body.paymentDate) : null,
  });
  res.json({ success: true, data: payment });
};


import { Request, Response } from 'express';
import * as opencartService from './opencart.service';

export const handleOrderEvent = async (req: Request, res: Response) => {
  try {
    opencartService.validateSignature(req.rawBody ?? req.body, req.headers['x-opencart-signature'] as string | undefined);
    const result = await opencartService.processOrderPayload(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const handleStatusUpdate = async (req: Request, res: Response) => {
  try {
    opencartService.validateSignature(req.rawBody ?? req.body, req.headers['x-opencart-signature'] as string | undefined);
    const result = await opencartService.updateOrderStatus(Number(req.params.orderId), req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};


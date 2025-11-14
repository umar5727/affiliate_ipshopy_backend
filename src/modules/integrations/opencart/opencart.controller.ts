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

export const getProgramStatus = async (req: Request, res: Response) => {
  try {
    opencartService.validateSignature(req.rawBody ?? req.body, req.headers['x-opencart-signature'] as string | undefined);
    const data = await opencartService.getProgramStatus();
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const getLinkDetails = async (req: Request, res: Response) => {
  try {
    opencartService.validateSignature(req.rawBody ?? req.body, req.headers['x-opencart-signature'] as string | undefined);
    const linkId = Number(req.body.linkId);
    if (!Number.isFinite(linkId) || linkId <= 0) {
      throw new Error('Invalid link id supplied');
    }

    const link = await opencartService.getLinkDetails(linkId);
    if (!link) {
      return res.status(404).json({ success: false, message: 'Link not found' });
    }

    res.json({ success: true, data: link });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const recordVisit = async (req: Request, res: Response) => {
  try {
    opencartService.validateSignature(req.rawBody ?? req.body, req.headers['x-opencart-signature'] as string | undefined);
    const linkId = Number(req.body.linkId);
    if (!Number.isFinite(linkId) || linkId <= 0) {
      throw new Error('Invalid link id supplied');
    }

    const result = await opencartService.recordVisit(linkId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};


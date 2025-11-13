import { Request, Response } from 'express';
import * as orderService from './order.service';

export const listOrders = async (req: Request, res: Response) => {
  const result = await orderService.listOrders(req.query as Record<string, string>);
  res.json({ success: true, ...result });
};

export const getOrder = async (req: Request, res: Response) => {
  const order = await orderService.getOrderWithItems(Number(req.params.id));
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  return res.json({ success: true, data: order });
};

export const recordOrder = async (req: Request, res: Response) => {
  const order = await orderService.recordOrder({
    ...req.body,
    orderDate: new Date(req.body.orderDate),
  });
  res.status(201).json({ success: true, data: order });
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  await orderService.updateOrderStatus(Number(req.params.id), req.body.status);
  res.json({ success: true });
};


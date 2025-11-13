import { env } from '../../../config/env';
import { verifySignature } from '../../../utils/hmac';
import * as affiliateService from '../../affiliates/affiliate.service';
import * as orderService from '../../orders/order.service';
import * as commissionService from '../../commissions/commission.service';
import * as settingService from '../../settings/setting.service';
import { OpenCartOrderPayload, StatusUpdatePayload } from './opencart.types';

const parseRate = async (): Promise<number> => {
  const setting = await settingService.getSetting('commission_global_rate');
  if (!setting) {
    return 10;
  }
  const rate = parseFloat(setting.value);
  return Number.isNaN(rate) ? 10 : rate;
};

export const validateSignature = (payload: unknown, signature: string | undefined): void => {
  if (!signature) {
    throw new Error('Missing signature header');
  }
  const body = payload instanceof Buffer ? payload.toString('utf8') : payload;
  const isValid = verifySignature(body, env.integrations.opencartSecret, signature);
  if (!isValid) {
    throw new Error('Invalid signature');
  }
};

export const processOrderPayload = async (payload: OpenCartOrderPayload) => {
  const affiliate = await affiliateService.getAffiliateById(payload.affiliateId);
  if (!affiliate) {
    throw new Error('Affiliate not found');
  }

  if (!payload.items?.length) {
    throw new Error('Order items are required');
  }

  const existing = await orderService.findByOpenCartId(payload.orderId);
  const commissionRate = await parseRate();
  const commissionAmount = Number(((payload.totalAmount * commissionRate) / 100).toFixed(2));

  if (existing) {
    await orderService.updateOrderStatus(existing.id, payload.status);
    const commission = await commissionService.findByOrderId(existing.id);
    if (commission) {
      await commissionService.updateCommissionStatus(commission.id, {
        status: payload.status === 'returned' ? 'returned' : commission.status,
        confirmationDate: payload.status === 'confirmed' ? new Date() : commission.confirmationDate,
      });
    }
    return { orderId: existing.id, status: 'updated', commissionAmount };
  }

  const order = await orderService.recordOrder({
    orderIdOpencart: payload.orderId,
    userId: payload.affiliateId,
    status: payload.status,
    totalAmount: payload.totalAmount,
    orderDate: new Date(payload.orderDate),
    items: payload.items,
  });

  await commissionService.createCommission({
    orderId: order.id,
    affiliateLinkId: payload.affiliateLinkId ?? null,
    amount: commissionAmount,
    status: payload.status === 'confirmed' ? 'confirmed' : 'pending',
    confirmationDate: payload.status === 'confirmed' ? new Date() : null,
  });

  return { orderId: order.id, status: 'created', commissionAmount };
};

export const updateOrderStatus = async (orderId: number, payload: StatusUpdatePayload) => {
  const order = await orderService.findByOpenCartId(orderId);
  if (!order) {
    throw new Error('Order not found');
  }

  await orderService.updateOrderStatus(order.id, payload.status);
  const commission = await commissionService.findByOrderId(order.id);
  if (commission) {
    await commissionService.updateCommissionStatus(commission.id, {
      status: payload.status,
      confirmationDate: payload.confirmationDate ? new Date(payload.confirmationDate) : null,
    });
  }

  return { orderId: order.id, status: payload.status };
};


import { Express, Router } from 'express';
import { healthRouter } from './health.route';
import { authRouter } from '../modules/auth/auth.routes';
import { affiliatesRouter } from '../modules/affiliates/affiliate.routes';
import { linksRouter } from '../modules/links/link.routes';
import { ordersRouter } from '../modules/orders/order.routes';
import { commissionsRouter } from '../modules/commissions/commission.routes';
import { paymentsRouter } from '../modules/payments/payment.routes';
import { settingsRouter } from '../modules/settings/setting.routes';
import { opencartRouter } from '../modules/integrations/opencart/opencart.routes';
import { analyticsRouter } from '../modules/analytics/analytics.routes';
import { adminAuthRouter } from '../modules/admin/admin.routes';
import { notificationRouter } from '../modules/notifications/notification.routes';

const API_PREFIX = '/api/v1';

export const registerRoutes = (app: Express) => {
  const router = Router();

  router.use('/health', healthRouter);
  router.use('/auth', authRouter);
  router.use('/admin/auth', adminAuthRouter);
  router.use('/notifications', notificationRouter);
  router.use('/affiliates', affiliatesRouter);
  router.use('/links', linksRouter);
  router.use('/orders', ordersRouter);
  router.use('/commissions', commissionsRouter);
  router.use('/payments', paymentsRouter);
  router.use('/settings', settingsRouter);
  router.use('/analytics', analyticsRouter);
  router.use('/integrations/opencart', opencartRouter);
  app.use(API_PREFIX, router);
};


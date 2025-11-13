import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import * as controller from './analytics.controller';

export const analyticsRouter = Router();

analyticsRouter.get('/overview', authenticate({ required: true, roles: ['admin', 'affiliate'] }), controller.getOverview);

analyticsRouter.get('/links', authenticate({ required: true, roles: ['admin', 'affiliate'] }), controller.getLinkPerformance);


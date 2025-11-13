import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';
import * as controller from './order.controller';
import * as validators from './order.validators';

export const ordersRouter = Router();

ordersRouter.get(
  '/',
  authenticate({ required: true, roles: ['admin', 'affiliate'] }),
  validate(validators.listOrdersSchema, 'query'),
  controller.listOrders,
);

ordersRouter.get('/:id', authenticate({ required: true, roles: ['admin', 'affiliate'] }), controller.getOrder);

ordersRouter.post(
  '/',
  authenticate({ required: true, roles: ['admin'] }),
  validate(validators.recordOrderSchema),
  controller.recordOrder,
);

ordersRouter.patch(
  '/:id/status',
  authenticate({ required: true, roles: ['admin'] }),
  validate(validators.updateStatusSchema),
  controller.updateOrderStatus,
);


import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';
import * as controller from './payment.controller';
import * as validators from './payment.validators';

export const paymentsRouter = Router();

paymentsRouter.get(
  '/',
  authenticate({ required: true, roles: ['admin', 'affiliate'] }),
  validate(validators.listPaymentsSchema, 'query'),
  controller.listPayments,
);

paymentsRouter.post(
  '/',
  authenticate({ required: true, roles: ['affiliate', 'admin'] }),
  validate(validators.createPaymentSchema),
  controller.createPayment,
);

paymentsRouter.patch(
  '/:id',
  authenticate({ required: true, roles: ['admin'] }),
  validate(validators.updatePaymentSchema),
  controller.updatePayment,
);


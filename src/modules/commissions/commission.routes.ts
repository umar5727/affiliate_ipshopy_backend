import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';
import * as controller from './commission.controller';
import * as validators from './commission.validators';

export const commissionsRouter = Router();

commissionsRouter.get(
  '/',
  authenticate({ required: true, roles: ['admin', 'affiliate'] }),
  validate(validators.listCommissionsSchema, 'query'),
  controller.listCommissions,
);

commissionsRouter.patch(
  '/:id',
  authenticate({ required: true, roles: ['admin'] }),
  validate(validators.updateCommissionSchema),
  controller.updateCommission,
);


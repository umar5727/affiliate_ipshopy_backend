import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';
import * as controller from './affiliate.controller';
import * as validators from './affiliate.validators';

export const affiliatesRouter = Router();

affiliatesRouter.get(
  '/',
  authenticate({ required: true, roles: ['admin'] }),
  validate(validators.listAffiliatesSchema, 'query'),
  controller.listAffiliates,
);

affiliatesRouter.get('/:id', authenticate({ roles: ['admin', 'affiliate'] }), controller.getAffiliate);

affiliatesRouter.post(
  '/',
  authenticate({ required: true, roles: ['admin'] }),
  validate(validators.createAffiliateSchema),
  controller.createAffiliate,
);

affiliatesRouter.patch(
  '/:id',
  authenticate({ required: true, roles: ['admin'] }),
  validate(validators.updateAffiliateSchema),
  controller.updateAffiliate,
);


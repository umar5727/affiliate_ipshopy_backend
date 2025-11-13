import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';
import * as controller from './link.controller';
import * as validators from './link.validators';

export const linksRouter = Router();

linksRouter.get(
  '/',
  authenticate({ required: true, roles: ['admin', 'affiliate'] }),
  validate(validators.listLinksSchema, 'query'),
  controller.listLinks,
);

linksRouter.patch(
  '/:id/status',
  authenticate({ required: true, roles: ['admin'] }),
  validate(validators.updateLinkStatusSchema),
  controller.updateLinkStatus,
);

linksRouter.post(
  '/',
  authenticate({ required: true, roles: ['admin', 'affiliate'] }),
  validate(validators.createLinkSchema),
  controller.createLink,
);


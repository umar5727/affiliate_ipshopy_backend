import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';
import * as controller from './setting.controller';
import * as validators from './setting.validators';

export const settingsRouter = Router();

settingsRouter.get('/', authenticate({ required: true, roles: ['admin'] }), controller.listSettings);

settingsRouter.get('/creator', authenticate({ required: false }), controller.getCreatorSettings);

settingsRouter.post(
  '/',
  authenticate({ required: true, roles: ['admin'] }),
  validate(validators.updateSettingSchema),
  controller.updateSetting,
);


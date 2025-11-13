import { Router } from 'express';
import { validate } from '../../../middlewares/validation.middleware';
import * as controller from './opencart.controller';
import * as validators from './opencart.validators';

export const opencartRouter = Router();

opencartRouter.post('/order', validate(validators.orderPayloadSchema), controller.handleOrderEvent);
opencartRouter.post('/order/:orderId/status', validate(validators.statusUpdateSchema), controller.handleStatusUpdate);


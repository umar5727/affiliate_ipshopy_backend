import { Router } from 'express';
import { validate } from '../../../middlewares/validation.middleware';
import * as controller from './opencart.controller';
import * as validators from './opencart.validators';

export const opencartRouter = Router();

opencartRouter.post('/program/status', validate(validators.programStatusSchema), controller.getProgramStatus);
opencartRouter.post('/link/lookup', validate(validators.linkLookupSchema), controller.getLinkDetails);
opencartRouter.post('/visit', validate(validators.visitPayloadSchema), controller.recordVisit);
opencartRouter.post('/order', validate(validators.orderPayloadSchema), controller.handleOrderEvent);
opencartRouter.post('/order/:orderId/status', validate(validators.statusUpdateSchema), controller.handleStatusUpdate);


import { Router } from 'express';
import { validate } from '../../middlewares/validation.middleware';
import * as controller from './admin.controller';
import * as validators from './admin.validators';

export const adminAuthRouter = Router();

adminAuthRouter.post('/otp/request', validate(validators.requestOtpSchema), controller.requestOtp);
adminAuthRouter.post('/otp/verify', validate(validators.verifyOtpSchema), controller.verifyOtp);
adminAuthRouter.post('/refresh', validate(validators.refreshSchema), controller.refreshToken);


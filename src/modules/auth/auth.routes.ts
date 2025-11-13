import { Router } from 'express';
import { validate } from '../../middlewares/validation.middleware';
import * as controller from './auth.controller';
import * as validators from './auth.validators';

export const authRouter = Router();

authRouter.post('/otp/request', validate(validators.requestOtpSchema), controller.requestOtp);
authRouter.post('/otp/verify', validate(validators.verifyOtpSchema), controller.verifyOtp);
authRouter.post('/refresh', validate(validators.refreshSchema), controller.refreshToken);


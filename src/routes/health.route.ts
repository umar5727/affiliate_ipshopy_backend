import { Router } from 'express';
import { healthCheck } from '../config/database';

export const healthRouter = Router();

healthRouter.get('/', async (_req, res, next) => {
  try {
    await healthCheck();
    res.json({ success: true, status: 'ok' });
  } catch (error) {
    next(error);
  }
});


import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import * as notificationService from './notification.service';

export const notificationRouter = Router();

notificationRouter.get('/', authenticate({ required: true, roles: ['affiliate', 'admin'] }), async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }
  const notifications = await notificationService.listForUser(req.user.id);
  return res.json({ success: true, data: notifications });
});

notificationRouter.patch('/:id', authenticate({ required: true, roles: ['affiliate', 'admin'] }), async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }
  await notificationService.markRead(Number(req.params.id), req.user.id);
  return res.json({ success: true });
});

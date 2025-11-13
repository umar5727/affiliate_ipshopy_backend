import * as repository from './notification.repository';
import { CreateNotificationInput } from './notification.types';

export const notify = (payload: CreateNotificationInput) => repository.createNotification(payload);

export const listForUser = (userId: number) => repository.listNotifications(userId);

export const markRead = (id: number, userId: number) => repository.markRead(id, userId);

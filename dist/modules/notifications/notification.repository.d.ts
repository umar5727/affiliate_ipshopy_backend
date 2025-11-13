import { Notification, CreateNotificationInput } from './notification.types';
export declare const createNotification: (payload: CreateNotificationInput) => Promise<Notification>;
export declare const listNotifications: (userId: number) => Promise<Notification[]>;
export declare const markRead: (id: number, userId: number) => Promise<void>;
//# sourceMappingURL=notification.repository.d.ts.map
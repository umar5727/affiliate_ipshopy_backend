import { CreateNotificationInput } from './notification.types';
export declare const notify: (payload: CreateNotificationInput) => Promise<import("./notification.types").Notification>;
export declare const listForUser: (userId: number) => Promise<import("./notification.types").Notification[]>;
export declare const markRead: (id: number, userId: number) => Promise<void>;
//# sourceMappingURL=notification.service.d.ts.map
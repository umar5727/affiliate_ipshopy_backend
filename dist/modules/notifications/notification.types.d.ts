export type NotificationType = 'info' | 'warning' | 'link_rejected' | 'link_approved';
export interface Notification {
    id: number;
    userId: number;
    title: string;
    body: string;
    type: NotificationType;
    readAt: Date | null;
    createdAt: Date;
}
export interface CreateNotificationInput {
    userId: number;
    title: string;
    body: string;
    type?: NotificationType;
}
//# sourceMappingURL=notification.types.d.ts.map
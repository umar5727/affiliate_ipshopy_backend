import { OpenCartOrderPayload, StatusUpdatePayload } from './opencart.types';
export declare const validateSignature: (payload: unknown, signature: string | undefined) => void;
export declare const processOrderPayload: (payload: OpenCartOrderPayload) => Promise<{
    orderId: number;
    status: string;
    commissionAmount: number;
}>;
export declare const updateOrderStatus: (orderId: number, payload: StatusUpdatePayload) => Promise<{
    orderId: number;
    status: "pending" | "confirmed" | "returned";
}>;
//# sourceMappingURL=opencart.service.d.ts.map
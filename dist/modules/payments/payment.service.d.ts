import { CreatePaymentRequest, UpdatePaymentStatus } from './payment.types';
export declare const listPayments: (query: Partial<Record<string, string>>) => Promise<import("../../types").PaginatedResult<import("./payment.types").Payment>>;
export declare const createPaymentRequest: (payload: CreatePaymentRequest) => Promise<import("./payment.types").Payment>;
export declare const updatePayment: (id: number, payload: UpdatePaymentStatus) => Promise<import("./payment.types").Payment | null>;
//# sourceMappingURL=payment.service.d.ts.map
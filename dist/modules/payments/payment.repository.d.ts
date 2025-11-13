import { CreatePaymentRequest, Payment, UpdatePaymentStatus } from './payment.types';
export declare const listPayments: (query: Partial<Record<string, string>>) => Promise<import("../../types").PaginatedResult<Payment>>;
export declare const createPaymentRequest: (payload: CreatePaymentRequest) => Promise<Payment>;
export declare const updatePayment: (id: number, payload: UpdatePaymentStatus) => Promise<Payment | null>;
//# sourceMappingURL=payment.repository.d.ts.map
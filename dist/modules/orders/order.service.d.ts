import { RecordOrderInput } from './order.types';
export declare const listOrders: (query: Partial<Record<string, string>>) => Promise<import("../../types").PaginatedResult<import("./order.types").Order>>;
export declare const getOrderWithItems: (id: number) => Promise<import("./order.types").OrderWithItems | null>;
export declare const findByOpenCartId: (orderIdOpencart: number) => Promise<import("./order.types").Order | null>;
export declare const recordOrder: (payload: RecordOrderInput) => Promise<import("./order.types").OrderWithItems>;
export declare const updateOrderStatus: (id: number, status: "pending" | "confirmed" | "returned") => Promise<void>;
//# sourceMappingURL=order.service.d.ts.map
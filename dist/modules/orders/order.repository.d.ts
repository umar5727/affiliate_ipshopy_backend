import { PoolConnection } from 'mysql2/promise';
import { Order, OrderWithItems, RecordOrderInput } from './order.types';
export declare const listOrders: (query: Partial<Record<string, string>>) => Promise<import("../../types").PaginatedResult<Order>>;
export declare const findByOpenCartId: (orderIdOpencart: number) => Promise<Order | null>;
export declare const getOrderWithItems: (id: number) => Promise<OrderWithItems | null>;
export declare const recordOrder: (input: RecordOrderInput, connection?: PoolConnection) => Promise<OrderWithItems>;
export declare const updateOrderStatus: (id: number, status: string, connection?: PoolConnection) => Promise<void>;
//# sourceMappingURL=order.repository.d.ts.map
import { UpdateCommissionStatusInput } from './commission.types';
export declare const listCommissions: (query: Partial<Record<string, string>>) => Promise<import("../../types").PaginatedResult<import("./commission.types").Commission>>;
export declare const updateCommissionStatus: (id: number, payload: UpdateCommissionStatusInput) => Promise<void>;
export declare const createCommission: (payload: import("./commission.types").CreateCommissionInput, connection?: import("mysql2/promise").PoolConnection) => Promise<import("./commission.types").Commission>;
export declare const findByOrderId: (orderId: number) => Promise<import("./commission.types").Commission | null>;
//# sourceMappingURL=commission.service.d.ts.map
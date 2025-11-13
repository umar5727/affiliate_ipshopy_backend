import { PoolConnection } from 'mysql2/promise';
import { Commission, CreateCommissionInput, UpdateCommissionStatusInput } from './commission.types';
export declare const listCommissions: (query: Partial<Record<string, string>>) => Promise<import("../../types").PaginatedResult<Commission>>;
export declare const updateCommissionStatus: (id: number, payload: UpdateCommissionStatusInput) => Promise<void>;
export declare const createCommission: (payload: CreateCommissionInput, connection?: PoolConnection) => Promise<Commission>;
export declare const findByOrderId: (orderId: number) => Promise<Commission | null>;
//# sourceMappingURL=commission.repository.d.ts.map
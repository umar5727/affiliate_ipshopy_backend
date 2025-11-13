import { FieldPacket, Pool, PoolConnection } from 'mysql2/promise';
export declare const getDbPool: () => Pool;
export declare const healthCheck: () => Promise<void>;
export declare const execute: <T>(sql: string, params?: unknown[], connection?: PoolConnection) => Promise<[T, FieldPacket[]]>;
export declare const withTransaction: <T>(runner: (conn: PoolConnection) => Promise<T>) => Promise<T>;
//# sourceMappingURL=database.d.ts.map
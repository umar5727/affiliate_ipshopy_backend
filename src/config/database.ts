import mysql, { FieldPacket, Pool, PoolConnection } from 'mysql2/promise';
import { env } from './env';

let pool: Pool;

export const getDbPool = (): Pool => {
  if (!pool) {
    pool = mysql.createPool({
      host: env.mysql.host,
      port: env.mysql.port,
      user: env.mysql.user,
      password: env.mysql.password,
      database: env.mysql.database,
      waitForConnections: true,
      connectionLimit: env.mysql.connectionLimit,
      queueLimit: 0,
    });
  }
  return pool;
};

export const healthCheck = async (): Promise<void> => {
  const connection = await getDbPool().getConnection();
  try {
    await connection.ping();
  } finally {
    connection.release();
  }
};

export const execute = async <T>(
  sql: string,
  params: unknown[] = [],
  connection?: PoolConnection,
): Promise<[T, FieldPacket[]]> => {
  const target = connection ?? getDbPool();
  const [rows, fields] = await target.query(sql, params);
  return [rows as T, fields];
};

export const withTransaction = async <T>(runner: (conn: PoolConnection) => Promise<T>): Promise<T> => {
  const conn = await getDbPool().getConnection();
  try {
    await conn.beginTransaction();
    const result = await runner(conn);
    await conn.commit();
    return result;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};


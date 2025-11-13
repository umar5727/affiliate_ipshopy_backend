"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withTransaction = exports.execute = exports.healthCheck = exports.getDbPool = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const env_1 = require("./env");
let pool;
const getDbPool = () => {
    if (!pool) {
        pool = promise_1.default.createPool({
            host: env_1.env.mysql.host,
            port: env_1.env.mysql.port,
            user: env_1.env.mysql.user,
            password: env_1.env.mysql.password,
            database: env_1.env.mysql.database,
            waitForConnections: true,
            connectionLimit: env_1.env.mysql.connectionLimit,
            queueLimit: 0,
        });
    }
    return pool;
};
exports.getDbPool = getDbPool;
const healthCheck = async () => {
    const connection = await (0, exports.getDbPool)().getConnection();
    try {
        await connection.ping();
    }
    finally {
        connection.release();
    }
};
exports.healthCheck = healthCheck;
const execute = async (sql, params = [], connection) => {
    const target = connection ?? (0, exports.getDbPool)();
    const [rows, fields] = await target.query(sql, params);
    return [rows, fields];
};
exports.execute = execute;
const withTransaction = async (runner) => {
    const conn = await (0, exports.getDbPool)().getConnection();
    try {
        await conn.beginTransaction();
        const result = await runner(conn);
        await conn.commit();
        return result;
    }
    catch (error) {
        await conn.rollback();
        throw error;
    }
    finally {
        conn.release();
    }
};
exports.withTransaction = withTransaction;
//# sourceMappingURL=database.js.map
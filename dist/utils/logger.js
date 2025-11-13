"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLogger = exports.logger = void 0;
const morgan_1 = __importDefault(require("morgan"));
const winston_1 = __importDefault(require("winston"));
const env_1 = require("../config/env");
const { combine, timestamp, errors, splat, printf, colorize } = winston_1.default.format;
const logFormat = printf((info) => {
    const { level, message, timestamp: ts, stack } = info;
    if (stack) {
        return `${ts} [${level}]: ${message}\n${stack}`;
    }
    return `${ts} [${level}]: ${message}`;
});
exports.logger = winston_1.default.createLogger({
    level: env_1.isProduction ? 'info' : 'debug',
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), splat(), env_1.isProduction ? logFormat : combine(colorize(), logFormat)),
    transports: [
        new winston_1.default.transports.Console({
            handleExceptions: true,
        }),
    ],
    exitOnError: false,
});
const stream = {
    write: (message) => {
        exports.logger.info(message.trim());
    },
};
exports.httpLogger = (0, morgan_1.default)(env_1.isProduction ? 'combined' : 'dev', { stream });
//# sourceMappingURL=logger.js.map
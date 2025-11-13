"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundHandler = void 0;
const logger_1 = require("../utils/logger");
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
};
exports.notFoundHandler = notFoundHandler;
const errorHandler = (err, req, res, _next) => {
    const status = err.status ?? 500;
    const responseBody = {
        success: false,
        message: err.message || 'Internal server error',
        details: err.details,
    };
    if (status >= 500) {
        logger_1.logger.error('Unhandled server error', { err });
    }
    else {
        logger_1.logger.warn(err.message);
    }
    res.status(status).json(responseBody);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map
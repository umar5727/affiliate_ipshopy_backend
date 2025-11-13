"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const compression_1 = __importDefault(require("compression"));
const logger_1 = require("./utils/logger");
const routes_1 = require("./routes");
const error_middleware_1 = require("./middlewares/error.middleware");
const createApp = () => {
    const app = (0, express_1.default)();
    app.set('trust proxy', 1);
    // CORS configuration - handle '*' in development for easier testing
    const corsOrigin = process.env.CORS_ORIGIN || '*';
    const corsOrigins = corsOrigin === '*' ? true : corsOrigin.split(',').map((o) => o.trim());
    // If '*' is used with credentials, use a function to allow all origins
    const corsConfig = corsOrigin === '*' && process.env.NODE_ENV !== 'production'
        ? {
            origin: (origin, callback) => {
                callback(null, true);
            },
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        }
        : {
            origin: corsOrigins,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        };
    app.use((0, cors_1.default)(corsConfig));
    // Configure helmet to not interfere with CORS
    app.use((0, helmet_1.default)({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        crossOriginEmbedderPolicy: false,
    }));
    app.use((0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: 500,
        standardHeaders: true,
        legacyHeaders: false,
    }));
    app.use((0, compression_1.default)());
    app.use(express_1.default.json({
        limit: '1mb',
        verify: (req, _res, buf) => {
            req.rawBody = Buffer.from(buf);
        },
    }));
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(logger_1.httpLogger);
    (0, routes_1.registerRoutes)(app);
    app.use(error_middleware_1.notFoundHandler);
    app.use(error_middleware_1.errorHandler);
    return app;
};
exports.createApp = createApp;
//# sourceMappingURL=app.js.map
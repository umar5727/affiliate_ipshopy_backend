"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const app_1 = require("./app");
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
const database_1 = require("./config/database");
const bootstrap = async () => {
    try {
        await (0, database_1.healthCheck)();
        const app = (0, app_1.createApp)();
        const httpServer = (0, http_1.createServer)(app);
        const port = env_1.env.port;
        httpServer.listen(port, () => {
            logger_1.logger.info(`Affiliate backend running on port ${port} (${env_1.env.nodeEnv})`);
        });
        const shutdown = (signal) => () => {
            logger_1.logger.info(`Received ${signal}, shutting down gracefully...`);
            httpServer.close(() => {
                logger_1.logger.info('HTTP server closed.');
                process.exit(0);
            });
        };
        ['SIGTERM', 'SIGINT'].forEach((signal) => {
            process.on(signal, shutdown(signal));
        });
        if (!env_1.isProduction) {
            process.on('unhandledRejection', (reason) => {
                logger_1.logger.error('Unhandled promise rejection', { reason });
            });
        }
    }
    catch (error) {
        logger_1.logger.error('Failed to bootstrap affiliate backend', { error });
        process.exit(1);
    }
};
bootstrap();
//# sourceMappingURL=server.js.map
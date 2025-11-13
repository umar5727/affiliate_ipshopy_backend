import { createServer } from 'http';
import { createApp } from './app';
import { env, isProduction } from './config/env';
import { logger } from './utils/logger';
import { healthCheck } from './config/database';

const bootstrap = async () => {
  try {
    await healthCheck();
    const app = createApp();
    const httpServer = createServer(app);

    const port = env.port;
    httpServer.listen(port, () => {
      logger.info(`Affiliate backend running on port ${port} (${env.nodeEnv})`);
    });

    const shutdown = (signal: string) => () => {
      logger.info(`Received ${signal}, shutting down gracefully...`);
      httpServer.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    ['SIGTERM', 'SIGINT'].forEach((signal) => {
      process.on(signal, shutdown(signal));
    });

    if (!isProduction) {
      process.on('unhandledRejection', (reason) => {
        logger.error('Unhandled promise rejection', { reason });
      });
    }
  } catch (error) {
    logger.error('Failed to bootstrap affiliate backend', { error });
    process.exit(1);
  }
};

bootstrap();


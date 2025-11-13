import express, { Request as ExpressRequest } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { httpLogger } from './utils/logger';
import { registerRoutes } from './routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

declare module 'express-serve-static-core' {
  interface Request {
    rawBody?: Buffer;
  }
}

export const createApp = () => {
  const app = express();

  app.set('trust proxy', 1);

  // CORS configuration - handle '*' in development for easier testing
  const corsOrigin = process.env.CORS_ORIGIN || '*';
  const corsOrigins = corsOrigin === '*' ? true : corsOrigin.split(',').map((o) => o.trim());
  
  // If '*' is used with credentials, use a function to allow all origins
  const corsConfig =
    corsOrigin === '*' && process.env.NODE_ENV !== 'production'
      ? {
          origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
            callback(null, true);
          },
          credentials: true,
          methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
          allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma'],
        }
      : {
          origin: corsOrigins,
          credentials: true,
          methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
          allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma'],
        };

  app.use(cors(corsConfig));

  // Configure helmet to not interfere with CORS
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginEmbedderPolicy: false,
    }),
  );
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 500,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );
  app.use(compression());
  app.use(
    express.json({
      limit: '1mb',
      verify: (req, _res, buf) => {
        (req as ExpressRequest).rawBody = Buffer.from(buf);
      },
    }),
  );
  app.use(express.urlencoded({ extended: true }));
  app.use(httpLogger);

  registerRoutes(app);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};


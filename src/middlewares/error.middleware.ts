import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

interface ApiError extends Error {
  status?: number;
  details?: unknown;
}

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

export const errorHandler = (err: ApiError, req: Request, res: Response, _next: NextFunction) => {
  const status = err.status ?? 500;
  const responseBody = {
    success: false,
    message: err.message || 'Internal server error',
    details: err.details,
  };

  if (status >= 500) {
    logger.error('Unhandled server error', { err });
  } else {
    logger.warn(err.message);
  }

  res.status(status).json(responseBody);
};


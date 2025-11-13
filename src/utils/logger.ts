import morgan, { StreamOptions } from 'morgan';
import winston, { Logform } from 'winston';
import { isProduction } from '../config/env';

const { combine, timestamp, errors, splat, printf, colorize } = winston.format;

const logFormat = printf((info: Logform.TransformableInfo) => {
  const { level, message, timestamp: ts, stack } = info;
  if (stack) {
    return `${ts} [${level}]: ${message}\n${stack}`;
  }
  return `${ts} [${level}]: ${message}`;
});

export const logger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    splat(),
    isProduction ? logFormat : combine(colorize(), logFormat),
  ),
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
    }),
  ],
  exitOnError: false,
});

const stream: StreamOptions = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export const httpLogger = morgan(isProduction ? 'combined' : 'dev', { stream });


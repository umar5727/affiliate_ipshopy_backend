import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

type ValidationTarget = 'body' | 'query' | 'params';

export const validate =
  (schema: Joi.ObjectSchema, target: ValidationTarget = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[target], {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        details: error.details.map((detail) => ({
          message: detail.message,
          path: detail.path,
        })),
      });
    }

    if (target === 'query' || target === 'params') {
      Object.assign(req[target], value);
    } else {
      req[target] = value as any;
    }
    return next();
  };


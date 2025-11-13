import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
type ValidationTarget = 'body' | 'query' | 'params';
export declare const validate: (schema: Joi.ObjectSchema, target?: ValidationTarget) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export {};
//# sourceMappingURL=validation.middleware.d.ts.map
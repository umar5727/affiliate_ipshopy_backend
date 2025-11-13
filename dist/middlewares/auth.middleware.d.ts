import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/jwt';
declare module 'express-serve-static-core' {
    interface Request {
        user?: ReturnType<typeof verifyAccessToken>;
    }
}
export declare const authenticate: (options?: {
    required?: boolean;
    roles?: Array<"affiliate" | "admin">;
}) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=auth.middleware.d.ts.map
import { Request, Response, NextFunction } from 'express';
interface ApiError extends Error {
    status?: number;
    details?: unknown;
}
export declare const notFoundHandler: (req: Request, res: Response) => void;
export declare const errorHandler: (err: ApiError, req: Request, res: Response, _next: NextFunction) => void;
export {};
//# sourceMappingURL=error.middleware.d.ts.map
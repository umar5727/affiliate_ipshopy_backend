import { Request, Response } from 'express';
export declare const listOrders: (req: Request, res: Response) => Promise<void>;
export declare const getOrder: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const recordOrder: (req: Request, res: Response) => Promise<void>;
export declare const updateOrderStatus: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=order.controller.d.ts.map
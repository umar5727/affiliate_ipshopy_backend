import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/jwt';

declare module 'express-serve-static-core' {
  interface Request {
    user?: ReturnType<typeof verifyAccessToken>;
  }
}

export const authenticate =
  (options: { required?: boolean; roles?: Array<'affiliate' | 'admin'> } = { required: true }) =>
  (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) {
      if (options.required) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }
      return next();
    }

    const [, token] = header.split(' ');
    if (!token) {
      return res.status(401).json({ success: false, message: 'Invalid authorization header' });
    }

    try {
      const user = verifyAccessToken(token);
      if (options.roles && !options.roles.includes(user.role)) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }
      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
  };


import { NextFunction, Request, Response } from 'express';
import { UserRole } from '../../../generated/prisma/enums';

export function requireRole(...roles: UserRole[]) {
  return function authorize(req: Request, res: Response, next: NextFunction): void {
    if (!req.user) {
      res.status(401).json({ message: 'Missing or invalid Authorization header' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    next();
  };
}

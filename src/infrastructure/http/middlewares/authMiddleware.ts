import { NextFunction, Request, Response } from 'express';
import { UserRole } from '../../../generated/prisma/enums';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { verifyJwt } from '../../../shared/utils/jwt';
import { prisma } from '../../database/prisma-client';
import { PrismaUserRepository } from '../../database/repositories/PrismaUserRepository';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: UserRole;
      };
    }
  }
}

export function createAuthMiddleware(userRepository: UserRepository) {
  return async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Missing or invalid Authorization header' });
      return;
    }

    const token = authHeader.slice('Bearer '.length);

    let payload;
    try {
      payload = verifyJwt(token);
    } catch {
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }

    const user = await userRepository.findById(payload.userId);
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    next();
  };
}

export const authenticate = createAuthMiddleware(new PrismaUserRepository(prisma));

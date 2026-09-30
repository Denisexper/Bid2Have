import { Router } from 'express';
import { prisma } from '../../database/prisma-client';
import { PrismaUserRepository } from '../../database/repositories/PrismaUserRepository';
import { ListUsersUseCase } from '../../../application/use-cases/user/ListUsersUseCase';
import { SuspendUserUseCase } from '../../../application/use-cases/user/SuspendUserUseCase';
import { ReactivateUserUseCase } from '../../../application/use-cases/user/ReactivateUserUseCase';
import { UserController } from '../controllers/user/UserController';
import { authenticate } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const userRepository = new PrismaUserRepository(prisma);

const listUsersUseCase = new ListUsersUseCase(userRepository);
const suspendUserUseCase = new SuspendUserUseCase(userRepository);
const reactivateUserUseCase = new ReactivateUserUseCase(userRepository);

const userController = new UserController(listUsersUseCase, suspendUserUseCase, reactivateUserUseCase);

export const userAdminRoutes = Router();

userAdminRoutes.get('/', authenticate, requireRole('SUPERADMIN'), userController.list);
userAdminRoutes.patch('/:id/suspend', authenticate, requireRole('SUPERADMIN'), userController.suspend);
userAdminRoutes.patch('/:id/reactivate', authenticate, requireRole('SUPERADMIN'), userController.reactivate);

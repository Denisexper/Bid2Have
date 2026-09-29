import { Router } from 'express';
import { prisma } from '../../database/prisma-client';
import { PrismaNotificationRepository } from '../../database/repositories/PrismaNotificationRepository';
import { ListNotificationsForUserUseCase } from '../../../application/use-cases/notification/ListNotificationsForUserUseCase';
import { MarkNotificationAsReadUseCase } from '../../../application/use-cases/notification/MarkNotificationAsReadUseCase';
import { NotificationController } from '../controllers/notification/NotificationController';
import { authenticate } from '../middlewares/authMiddleware';

const notificationRepository = new PrismaNotificationRepository(prisma);
const listNotificationsForUserUseCase = new ListNotificationsForUserUseCase(notificationRepository);
const markNotificationAsReadUseCase = new MarkNotificationAsReadUseCase(notificationRepository);

const notificationController = new NotificationController(
  listNotificationsForUserUseCase,
  markNotificationAsReadUseCase,
);

export const notificationRoutes = Router();

notificationRoutes.get('/', authenticate, notificationController.list);
notificationRoutes.patch('/:id/read', authenticate, notificationController.markAsRead);

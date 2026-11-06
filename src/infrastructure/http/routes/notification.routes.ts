import { Router } from 'express';
import { prisma } from '../../database/prisma-client';
import { PrismaNotificationRepository } from '../../database/repositories/PrismaNotificationRepository';
import { ListNotificationsForUserUseCase } from '../../../application/use-cases/notification/ListNotificationsForUserUseCase';
import { MarkNotificationAsReadUseCase } from '../../../application/use-cases/notification/MarkNotificationAsReadUseCase';
import { ClearNotificationsUseCase } from '../../../application/use-cases/notification/ClearNotificationsUseCase';
import { NotificationController } from '../controllers/notification/NotificationController';
import { authenticate } from '../middlewares/authMiddleware';

const notificationRepository = new PrismaNotificationRepository(prisma);
const listNotificationsForUserUseCase = new ListNotificationsForUserUseCase(notificationRepository);
const markNotificationAsReadUseCase = new MarkNotificationAsReadUseCase(notificationRepository);
const clearNotificationsUseCase = new ClearNotificationsUseCase(notificationRepository);

const notificationController = new NotificationController(
  listNotificationsForUserUseCase,
  markNotificationAsReadUseCase,
  clearNotificationsUseCase,
);

export const notificationRoutes = Router();

notificationRoutes.get('/', authenticate, notificationController.list);
notificationRoutes.patch('/:id/read', authenticate, notificationController.markAsRead);
notificationRoutes.delete('/', authenticate, notificationController.clearAll);

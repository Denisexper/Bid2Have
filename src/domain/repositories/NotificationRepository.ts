import { Notification } from '../entities/Notification';
import { NotificationType } from '../../generated/prisma/enums';

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  payload?: Record<string, unknown> | null;
}

export interface NotificationRepository {
  create(input: CreateNotificationInput): Promise<Notification>;
  findById(id: string): Promise<Notification | null>;
  findByUserId(userId: string, unreadOnly?: boolean): Promise<Notification[]>;
  markAsRead(id: string): Promise<Notification | null>;
}

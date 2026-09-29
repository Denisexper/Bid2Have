import { Notification } from '../../../domain/entities/Notification';
import { NotificationRepository } from '../../../domain/repositories/NotificationRepository';

export class ListNotificationsForUserUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(userId: string, unreadOnly?: boolean): Promise<Notification[]> {
    return this.notificationRepository.findByUserId(userId, unreadOnly);
  }
}

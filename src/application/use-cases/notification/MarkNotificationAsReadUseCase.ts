import { Notification } from '../../../domain/entities/Notification';
import { NotificationRepository } from '../../../domain/repositories/NotificationRepository';
import { NotificationNotFoundError } from '../../../domain/errors/notification/NotificationNotFoundError';
import { ForbiddenNotificationActionError } from '../../../domain/errors/notification/ForbiddenNotificationActionError';

export class MarkNotificationAsReadUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) {
      throw new NotificationNotFoundError(id);
    }

    if (notification.userId !== userId) {
      throw new ForbiddenNotificationActionError();
    }

    const updated = await this.notificationRepository.markAsRead(id);
    if (!updated) {
      throw new NotificationNotFoundError(id);
    }

    return updated;
  }
}

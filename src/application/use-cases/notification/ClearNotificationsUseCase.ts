import { NotificationRepository } from '../../../domain/repositories/NotificationRepository';

export class ClearNotificationsUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(userId: string): Promise<void> {
    await this.notificationRepository.deleteAllByUserId(userId);
  }
}

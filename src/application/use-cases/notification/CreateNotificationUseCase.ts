import { Notification } from '../../../domain/entities/Notification';
import { CreateNotificationInput, NotificationRepository } from '../../../domain/repositories/NotificationRepository';

export class CreateNotificationUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(input: CreateNotificationInput): Promise<Notification> {
    return this.notificationRepository.create(input);
  }
}

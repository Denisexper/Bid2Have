import { Request, Response } from 'express';
import { ListNotificationsForUserUseCase } from '../../../../application/use-cases/notification/ListNotificationsForUserUseCase';
import { MarkNotificationAsReadUseCase } from '../../../../application/use-cases/notification/MarkNotificationAsReadUseCase';
import { NotificationNotFoundError } from '../../../../domain/errors/notification/NotificationNotFoundError';
import { ForbiddenNotificationActionError } from '../../../../domain/errors/notification/ForbiddenNotificationActionError';

export class NotificationController {
  constructor(
    private readonly listNotificationsForUserUseCase: ListNotificationsForUserUseCase,
    private readonly markNotificationAsReadUseCase: MarkNotificationAsReadUseCase,
  ) {}

  list = async (req: Request, res: Response): Promise<void> => {
    const unreadOnly = req.query.unread === 'true';
    const notifications = await this.listNotificationsForUserUseCase.execute(req.user!.id, unreadOnly);
    res.status(200).json({ notifications });
  };

  markAsRead = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const notification = await this.markNotificationAsReadUseCase.execute(id, req.user!.id);
      res.status(200).json({ notification });
    } catch (error) {
      if (error instanceof NotificationNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof ForbiddenNotificationActionError) {
        res.status(403).json({ message: error.message });
        return;
      }
      throw error;
    }
  };
}

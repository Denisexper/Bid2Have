import { NotificationType } from '../../generated/prisma/enums';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  payload: Record<string, unknown> | null;
  read: boolean;
  createdAt: Date;
}

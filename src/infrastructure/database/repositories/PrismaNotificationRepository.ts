import { PrismaClient, Prisma } from '../../../generated/prisma/client';
import { Notification } from '../../../domain/entities/Notification';
import { CreateNotificationInput, NotificationRepository } from '../../../domain/repositories/NotificationRepository';

type PrismaNotification = Awaited<ReturnType<PrismaClient['notification']['findUniqueOrThrow']>>;

function toDomain(notification: PrismaNotification): Notification {
  return { ...notification, payload: notification.payload as Record<string, unknown> | null };
}

export class PrismaNotificationRepository implements NotificationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(input: CreateNotificationInput): Promise<Notification> {
    const notification = await this.prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        ...(input.payload != null ? { payload: input.payload as Prisma.InputJsonValue } : {}),
      },
    });
    return toDomain(notification);
  }

  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    return notification ? toDomain(notification) : null;
  }

  async findByUserId(userId: string, unreadOnly?: boolean): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      where: unreadOnly ? { userId, read: false } : { userId },
      orderBy: { createdAt: 'desc' },
    });
    return notifications.map(toDomain);
  }

  async markAsRead(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notification
      .update({ where: { id }, data: { read: true } })
      .catch(() => null);
    return notification ? toDomain(notification) : null;
  }
}

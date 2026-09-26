import { PrismaClient } from '../../../generated/prisma/client';
import { Message } from '../../../domain/entities/Message';
import { MessageRepository, CreateMessageInput } from '../../../domain/repositories/MessageRepository';

export class PrismaMessageRepository implements MessageRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(input: CreateMessageInput): Promise<Message> {
    return this.prisma.message.create({ data: input });
  }

  async findByChatId(chatId: string): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
    });
  }
}

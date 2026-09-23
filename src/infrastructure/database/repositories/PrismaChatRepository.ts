import { PrismaClient } from '../../../generated/prisma/client';
import { Chat } from '../../../domain/entities/Chat';
import { ChatRepository, CreateChatInput } from '../../../domain/repositories/ChatRepository';

export class PrismaChatRepository implements ChatRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(input: CreateChatInput): Promise<Chat> {
    return this.prisma.chat.create({ data: input });
  }

  async findById(id: string): Promise<Chat | null> {
    return this.prisma.chat.findUnique({ where: { id } });
  }

  async findByOfferId(offerId: string): Promise<Chat | null> {
    return this.prisma.chat.findUnique({ where: { offerId } });
  }

  async findByUserId(userId: string): Promise<Chat[]> {
    return this.prisma.chat.findMany({
      where: { OR: [{ buyerId: userId }, { sellerId: userId }] },
      orderBy: { createdAt: 'desc' },
    });
  }
}

import { Message } from '../../../domain/entities/Message';
import { ChatRepository } from '../../../domain/repositories/ChatRepository';
import { MessageRepository } from '../../../domain/repositories/MessageRepository';
import { ChatNotFoundError } from '../../../domain/errors/chat/ChatNotFoundError';
import { ForbiddenChatActionError } from '../../../domain/errors/chat/ForbiddenChatActionError';
import { ActingUser } from '../../shared/ActingUser';
import { UserRole } from '../../../generated/prisma/enums';

export class ListMessagesForChatUseCase {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly messageRepository: MessageRepository,
  ) {}

  async execute(chatId: string, actingUser: ActingUser): Promise<Message[]> {
    const chat = await this.chatRepository.findById(chatId);
    if (!chat) {
      throw new ChatNotFoundError(chatId);
    }

    if (
      actingUser.role !== UserRole.SUPERADMIN &&
      chat.buyerId !== actingUser.id &&
      chat.sellerId !== actingUser.id
    ) {
      throw new ForbiddenChatActionError();
    }

    return this.messageRepository.findByChatId(chatId);
  }
}

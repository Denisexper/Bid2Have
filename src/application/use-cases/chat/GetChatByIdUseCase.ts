import { Chat } from '../../../domain/entities/Chat';
import { ChatRepository } from '../../../domain/repositories/ChatRepository';
import { ChatNotFoundError } from '../../../domain/errors/chat/ChatNotFoundError';
import { ForbiddenChatActionError } from '../../../domain/errors/chat/ForbiddenChatActionError';
import { ActingUser } from '../../shared/ActingUser';
import { UserRole } from '../../../generated/prisma/enums';

export class GetChatByIdUseCase {
  constructor(private readonly chatRepository: ChatRepository) {}

  async execute(id: string, actingUser: ActingUser): Promise<Chat> {
    const chat = await this.chatRepository.findById(id);
    if (!chat) {
      throw new ChatNotFoundError(id);
    }

    if (
      actingUser.role !== UserRole.SUPERADMIN &&
      chat.buyerId !== actingUser.id &&
      chat.sellerId !== actingUser.id
    ) {
      throw new ForbiddenChatActionError();
    }

    return chat;
  }
}

import { ChatRepository } from '../../../domain/repositories/ChatRepository';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { ChatNotFoundError } from '../../../domain/errors/chat/ChatNotFoundError';
import { ForbiddenChatActionError } from '../../../domain/errors/chat/ForbiddenChatActionError';
import { ActingUser } from '../../shared/ActingUser';
import { UserRole } from '../../../generated/prisma/enums';
import { ChatWithParticipants, toChatParticipant } from '../../dtos/ChatWithParticipants';

export class GetChatByIdUseCase {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string, actingUser: ActingUser): Promise<ChatWithParticipants> {
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

    const [buyer, seller] = await Promise.all([
      this.userRepository.findById(chat.buyerId),
      this.userRepository.findById(chat.sellerId),
    ]);

    // buyerId/sellerId are foreign keys to users, so both lookups are guaranteed to resolve.
    return { ...chat, buyer: toChatParticipant(buyer!), seller: toChatParticipant(seller!) };
  }
}

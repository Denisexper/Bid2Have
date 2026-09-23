import { Message } from '../../../domain/entities/Message';
import { ChatRepository } from '../../../domain/repositories/ChatRepository';
import { MessageRepository } from '../../../domain/repositories/MessageRepository';
import { ChatNotFoundError } from '../../../domain/errors/chat/ChatNotFoundError';
import { ForbiddenChatActionError } from '../../../domain/errors/chat/ForbiddenChatActionError';
import { InvalidMessageContentError } from '../../../domain/errors/chat/InvalidMessageContentError';

export interface SendMessageRequest {
  chatId: string;
  senderId: string;
  content: string;
}

export class SendMessageUseCase {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly messageRepository: MessageRepository,
  ) {}

  async execute(request: SendMessageRequest): Promise<Message> {
    const chat = await this.chatRepository.findById(request.chatId);
    if (!chat) {
      throw new ChatNotFoundError(request.chatId);
    }

    if (chat.buyerId !== request.senderId && chat.sellerId !== request.senderId) {
      throw new ForbiddenChatActionError();
    }

    const content = request.content.trim();
    if (!content) {
      throw new InvalidMessageContentError();
    }

    return this.messageRepository.create({
      chatId: request.chatId,
      senderId: request.senderId,
      content,
    });
  }
}

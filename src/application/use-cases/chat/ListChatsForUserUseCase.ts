import { Chat } from '../../../domain/entities/Chat';
import { ChatRepository } from '../../../domain/repositories/ChatRepository';
import { ActingUser } from '../../shared/ActingUser';

export class ListChatsForUserUseCase {
  constructor(private readonly chatRepository: ChatRepository) {}

  async execute(actingUser: ActingUser): Promise<Chat[]> {
    return this.chatRepository.findByUserId(actingUser.id);
  }
}

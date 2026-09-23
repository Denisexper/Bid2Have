import { Message } from '../entities/Message';

export interface CreateMessageInput {
  chatId: string;
  senderId: string;
  content: string;
}

export interface MessageRepository {
  create(input: CreateMessageInput): Promise<Message>;
  findByChatId(chatId: string): Promise<Message[]>;
}

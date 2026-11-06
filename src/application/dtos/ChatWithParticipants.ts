import { Chat } from '../../domain/entities/Chat';
import { User } from '../../domain/entities/User';

export interface ChatParticipant {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

export interface ChatWithParticipants extends Chat {
  buyer: ChatParticipant;
  seller: ChatParticipant;
}

export function toChatParticipant(user: User): ChatParticipant {
  return { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl };
}

import { Chat } from '../entities/Chat';

export interface CreateChatInput {
  listingId: string;
  offerId: string;
  buyerId: string;
  sellerId: string;
}

export interface ChatRepository {
  create(input: CreateChatInput): Promise<Chat>;
  findById(id: string): Promise<Chat | null>;
  findByOfferId(offerId: string): Promise<Chat | null>;
  findByUserId(userId: string): Promise<Chat[]>;
}

import { Router } from 'express';
import { prisma } from '../../database/prisma-client';
import { PrismaChatRepository } from '../../database/repositories/PrismaChatRepository';
import { PrismaMessageRepository } from '../../database/repositories/PrismaMessageRepository';
import { ListChatsForUserUseCase } from '../../../application/use-cases/chat/ListChatsForUserUseCase';
import { GetChatByIdUseCase } from '../../../application/use-cases/chat/GetChatByIdUseCase';
import { ListMessagesForChatUseCase } from '../../../application/use-cases/message/ListMessagesForChatUseCase';
import { ChatController } from '../controllers/chat/ChatController';
import { authenticate } from '../middlewares/authMiddleware';

const chatRepository = new PrismaChatRepository(prisma);
const messageRepository = new PrismaMessageRepository(prisma);
const listChatsForUserUseCase = new ListChatsForUserUseCase(chatRepository);
const getChatByIdUseCase = new GetChatByIdUseCase(chatRepository);
const listMessagesForChatUseCase = new ListMessagesForChatUseCase(chatRepository, messageRepository);

const chatController = new ChatController(
  listChatsForUserUseCase,
  getChatByIdUseCase,
  listMessagesForChatUseCase,
);

export const chatRoutes = Router();

chatRoutes.get('/', authenticate, chatController.listMine);
chatRoutes.get('/:id', authenticate, chatController.getById);
chatRoutes.get('/:chatId/messages', authenticate, chatController.listMessages);

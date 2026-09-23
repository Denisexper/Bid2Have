import express, { Request, Response } from 'express';
import http from 'http';
import { env } from './infrastructure/config/env';
import { authRoutes } from './infrastructure/http/routes/auth.routes';
import { categoryRoutes } from './infrastructure/http/routes/category.routes';
import { listingRoutes } from './infrastructure/http/routes/listing.routes';
import { listingOfferRoutes, offerRoutes } from './infrastructure/http/routes/offer.routes';
import { chatRoutes } from './infrastructure/http/routes/chat.routes';
import { prisma } from './infrastructure/database/prisma-client';
import { PrismaUserRepository } from './infrastructure/database/repositories/PrismaUserRepository';
import { PrismaChatRepository } from './infrastructure/database/repositories/PrismaChatRepository';
import { PrismaMessageRepository } from './infrastructure/database/repositories/PrismaMessageRepository';
import { GetChatByIdUseCase } from './application/use-cases/chat/GetChatByIdUseCase';
import { SendMessageUseCase } from './application/use-cases/message/SendMessageUseCase';
import { createSocketServer } from './infrastructure/realtime/socket';

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/listings', listingRoutes);
app.use('/listings', listingOfferRoutes);
app.use('/offers', offerRoutes);
app.use('/chats', chatRoutes);

const httpServer = http.createServer(app);

const userRepository = new PrismaUserRepository(prisma);
const chatRepository = new PrismaChatRepository(prisma);
const messageRepository = new PrismaMessageRepository(prisma);
const getChatByIdUseCase = new GetChatByIdUseCase(chatRepository);
const sendMessageUseCase = new SendMessageUseCase(chatRepository, messageRepository);

createSocketServer(httpServer, userRepository, getChatByIdUseCase, sendMessageUseCase);

httpServer.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
});
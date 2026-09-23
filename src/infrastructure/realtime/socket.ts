import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { verifyJwt } from '../../shared/utils/jwt';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { GetChatByIdUseCase } from '../../application/use-cases/chat/GetChatByIdUseCase';
import { SendMessageUseCase } from '../../application/use-cases/message/SendMessageUseCase';
import { ActingUser } from '../../application/shared/ActingUser';

interface JoinChatPayload {
  chatId: string;
}

interface SendMessagePayload {
  chatId: string;
  content: string;
}

function chatRoom(chatId: string): string {
  return `chat:${chatId}`;
}

export function createSocketServer(
  httpServer: HttpServer,
  userRepository: UserRepository,
  getChatByIdUseCase: GetChatByIdUseCase,
  sendMessageUseCase: SendMessageUseCase,
): Server {
  const io = new Server(httpServer, {
    cors: { origin: '*' },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) {
      next(new Error('Missing auth token'));
      return;
    }

    try {
      const payload = verifyJwt(token);
      const user = await userRepository.findById(payload.userId);
      if (!user) {
        next(new Error('User not found'));
        return;
      }

      const actingUser: ActingUser = { id: user.id, role: user.role };
      socket.data.user = actingUser;
      next();
    } catch {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const actingUser = socket.data.user as ActingUser;

    socket.on('join_chat', async ({ chatId }: JoinChatPayload) => {
      try {
        await getChatByIdUseCase.execute(chatId, actingUser);
        socket.join(chatRoom(chatId));
      } catch (error) {
        socket.emit('error', { message: error instanceof Error ? error.message : 'Unable to join chat' });
      }
    });

    socket.on('send_message', async ({ chatId, content }: SendMessagePayload) => {
      try {
        const message = await sendMessageUseCase.execute({
          chatId,
          senderId: actingUser.id,
          content,
        });
        io.to(chatRoom(message.chatId)).emit('new_message', message);
      } catch (error) {
        socket.emit('error', { message: error instanceof Error ? error.message : 'Unable to send message' });
      }
    });
  });

  return io;
}

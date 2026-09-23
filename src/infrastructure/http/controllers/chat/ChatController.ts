import { Request, Response } from 'express';
import { ListChatsForUserUseCase } from '../../../../application/use-cases/chat/ListChatsForUserUseCase';
import { GetChatByIdUseCase } from '../../../../application/use-cases/chat/GetChatByIdUseCase';
import { ListMessagesForChatUseCase } from '../../../../application/use-cases/message/ListMessagesForChatUseCase';
import { ChatNotFoundError } from '../../../../domain/errors/chat/ChatNotFoundError';
import { ForbiddenChatActionError } from '../../../../domain/errors/chat/ForbiddenChatActionError';

export class ChatController {
  constructor(
    private readonly listChatsForUserUseCase: ListChatsForUserUseCase,
    private readonly getChatByIdUseCase: GetChatByIdUseCase,
    private readonly listMessagesForChatUseCase: ListMessagesForChatUseCase,
  ) {}

  listMine = async (req: Request, res: Response): Promise<void> => {
    const chats = await this.listChatsForUserUseCase.execute(req.user!);
    res.status(200).json({ chats });
  };

  getById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const chat = await this.getChatByIdUseCase.execute(id, req.user!);
      res.status(200).json({ chat });
    } catch (error) {
      if (error instanceof ChatNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof ForbiddenChatActionError) {
        res.status(403).json({ message: error.message });
        return;
      }
      throw error;
    }
  };

  listMessages = async (req: Request<{ chatId: string }>, res: Response): Promise<void> => {
    const { chatId } = req.params;

    try {
      const messages = await this.listMessagesForChatUseCase.execute(chatId, req.user!);
      res.status(200).json({ messages });
    } catch (error) {
      if (error instanceof ChatNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof ForbiddenChatActionError) {
        res.status(403).json({ message: error.message });
        return;
      }
      throw error;
    }
  };
}

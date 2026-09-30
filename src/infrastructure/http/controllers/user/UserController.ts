import { Request, Response } from 'express';
import { ListUsersUseCase } from '../../../../application/use-cases/user/ListUsersUseCase';
import { SuspendUserUseCase } from '../../../../application/use-cases/user/SuspendUserUseCase';
import { ReactivateUserUseCase } from '../../../../application/use-cases/user/ReactivateUserUseCase';
import { UserNotFoundError } from '../../../../domain/errors/user/UserNotFoundError';
import { InvalidUserStateError } from '../../../../domain/errors/user/InvalidUserStateError';
import { CannotSuspendSelfError } from '../../../../domain/errors/user/CannotSuspendSelfError';
import { UserStatus } from '../../../../generated/prisma/enums';

export class UserController {
  constructor(
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly suspendUserUseCase: SuspendUserUseCase,
    private readonly reactivateUserUseCase: ReactivateUserUseCase,
  ) {}

  list = async (req: Request, res: Response): Promise<void> => {
    const { status } = req.query;

    if (status !== undefined && !Object.values(UserStatus).includes(status as UserStatus)) {
      res.status(400).json({ message: `status must be one of: ${Object.values(UserStatus).join(', ')}` });
      return;
    }

    const users = await this.listUsersUseCase.execute(status as UserStatus | undefined);
    res.status(200).json({ users });
  };

  suspend = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const user = await this.suspendUserUseCase.execute(id, req.user!.id);
      res.status(200).json({ user });
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof CannotSuspendSelfError || error instanceof InvalidUserStateError) {
        res.status(409).json({ message: error.message });
        return;
      }
      throw error;
    }
  };

  reactivate = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const user = await this.reactivateUserUseCase.execute(id);
      res.status(200).json({ user });
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof InvalidUserStateError) {
        res.status(409).json({ message: error.message });
        return;
      }
      throw error;
    }
  };
}

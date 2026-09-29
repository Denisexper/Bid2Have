import { Request, Response } from 'express';
import { FollowUserUseCase } from '../../../../application/use-cases/follow/FollowUserUseCase';
import { UnfollowUserUseCase } from '../../../../application/use-cases/follow/UnfollowUserUseCase';
import { ListFollowedSellersUseCase } from '../../../../application/use-cases/follow/ListFollowedSellersUseCase';
import { CannotFollowSelfError } from '../../../../domain/errors/follow/CannotFollowSelfError';
import { AlreadyFollowingError } from '../../../../domain/errors/follow/AlreadyFollowingError';
import { NotFollowingError } from '../../../../domain/errors/follow/NotFollowingError';
import { UserNotFoundError } from '../../../../domain/errors/user/UserNotFoundError';

export class FollowController {
  constructor(
    private readonly followUserUseCase: FollowUserUseCase,
    private readonly unfollowUserUseCase: UnfollowUserUseCase,
    private readonly listFollowedSellersUseCase: ListFollowedSellersUseCase,
  ) {}

  follow = async (req: Request<{ userId: string }>, res: Response): Promise<void> => {
    const { userId } = req.params;

    try {
      const follow = await this.followUserUseCase.execute(req.user!.id, userId);
      res.status(201).json({ follow });
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof CannotFollowSelfError || error instanceof AlreadyFollowingError) {
        res.status(409).json({ message: error.message });
        return;
      }
      throw error;
    }
  };

  unfollow = async (req: Request<{ userId: string }>, res: Response): Promise<void> => {
    const { userId } = req.params;

    try {
      await this.unfollowUserUseCase.execute(req.user!.id, userId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof NotFollowingError) {
        res.status(404).json({ message: error.message });
        return;
      }
      throw error;
    }
  };

  listFollowing = async (req: Request, res: Response): Promise<void> => {
    const follows = await this.listFollowedSellersUseCase.execute(req.user!.id);
    res.status(200).json({ follows });
  };
}

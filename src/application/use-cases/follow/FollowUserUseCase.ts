import { Follow } from '../../../domain/entities/Follow';
import { FollowRepository } from '../../../domain/repositories/FollowRepository';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { CannotFollowSelfError } from '../../../domain/errors/follow/CannotFollowSelfError';
import { AlreadyFollowingError } from '../../../domain/errors/follow/AlreadyFollowingError';
import { UserNotFoundError } from '../../../domain/errors/user/UserNotFoundError';

export class FollowUserUseCase {
  constructor(
    private readonly followRepository: FollowRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(followerId: string, followingId: string): Promise<Follow> {
    if (followerId === followingId) {
      throw new CannotFollowSelfError();
    }

    const followingUser = await this.userRepository.findById(followingId);
    if (!followingUser) {
      throw new UserNotFoundError(followingId);
    }

    const existing = await this.followRepository.findByFollowerAndFollowing(followerId, followingId);
    if (existing) {
      throw new AlreadyFollowingError();
    }

    return this.followRepository.create({ followerId, followingId });
  }
}

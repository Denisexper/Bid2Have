import { FollowRepository } from '../../../domain/repositories/FollowRepository';
import { NotFollowingError } from '../../../domain/errors/follow/NotFollowingError';

export class UnfollowUserUseCase {
  constructor(private readonly followRepository: FollowRepository) {}

  async execute(followerId: string, followingId: string): Promise<void> {
    const existing = await this.followRepository.findByFollowerAndFollowing(followerId, followingId);
    if (!existing) {
      throw new NotFollowingError();
    }

    await this.followRepository.delete(followerId, followingId);
  }
}

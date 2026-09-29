import { Follow } from '../../../domain/entities/Follow';
import { FollowRepository } from '../../../domain/repositories/FollowRepository';

export class ListFollowedSellersUseCase {
  constructor(private readonly followRepository: FollowRepository) {}

  async execute(followerId: string): Promise<Follow[]> {
    return this.followRepository.findFollowingByFollowerId(followerId);
  }
}

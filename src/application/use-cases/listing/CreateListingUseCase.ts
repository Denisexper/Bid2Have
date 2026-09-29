import { Listing } from '../../../domain/entities/Listing';
import { CreateListingInput, ListingRepository } from '../../../domain/repositories/ListingRepository';
import { CategoryRepository } from '../../../domain/repositories/CategoryRepository';
import { FollowRepository } from '../../../domain/repositories/FollowRepository';
import { NotificationRepository } from '../../../domain/repositories/NotificationRepository';
import { CategoryNotFoundError } from '../../../domain/errors/category/CategoryNotFoundError';
import { NotificationType } from '../../../generated/prisma/enums';

export class CreateListingUseCase {
  constructor(
    private readonly listingRepository: ListingRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly followRepository: FollowRepository,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(input: CreateListingInput): Promise<Listing> {
    const category = await this.categoryRepository.findById(input.categoryId);
    if (!category) {
      throw new CategoryNotFoundError(input.categoryId);
    }

    const listing = await this.listingRepository.create(input);

    const followers = await this.followRepository.findFollowersByFollowingId(listing.sellerId);
    await Promise.all(
      followers.map((follow) =>
        this.notificationRepository.create({
          userId: follow.followerId,
          type: NotificationType.FOLLOWED_SELLER_NEW_LISTING,
          payload: { listingId: listing.id, sellerId: listing.sellerId },
        }),
      ),
    );

    return listing;
  }
}

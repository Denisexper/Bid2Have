import { Listing } from '../../../domain/entities/Listing';
import { ListingRepository, UpdateListingInput } from '../../../domain/repositories/ListingRepository';
import { CategoryRepository } from '../../../domain/repositories/CategoryRepository';
import { ListingNotFoundError } from '../../../domain/errors/listing/ListingNotFoundError';
import { ForbiddenListingActionError } from '../../../domain/errors/listing/ForbiddenListingActionError';
import { CategoryNotFoundError } from '../../../domain/errors/category/CategoryNotFoundError';
import { UserRole } from '../../../generated/prisma/enums';
import { ActingUser } from '../../shared/ActingUser';

export class UpdateListingUseCase {
  constructor(
    private readonly listingRepository: ListingRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(id: string, input: UpdateListingInput, actingUser: ActingUser): Promise<Listing> {
    const listing = await this.listingRepository.findById(id);
    if (!listing) {
      throw new ListingNotFoundError(id);
    }

    if (actingUser.role !== UserRole.SUPERADMIN && listing.sellerId !== actingUser.id) {
      throw new ForbiddenListingActionError();
    }

    if (input.categoryId) {
      const category = await this.categoryRepository.findById(input.categoryId);
      if (!category) {
        throw new CategoryNotFoundError(input.categoryId);
      }
    }

    const updated = await this.listingRepository.updateById(id, input);
    if (!updated) {
      throw new ListingNotFoundError(id);
    }

    return updated;
  }
}

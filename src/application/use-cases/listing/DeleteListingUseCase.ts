import { ListingRepository } from '../../../domain/repositories/ListingRepository';
import { ListingNotFoundError } from '../../../domain/errors/listing/ListingNotFoundError';
import { ForbiddenListingActionError } from '../../../domain/errors/listing/ForbiddenListingActionError';
import { UserRole } from '../../../generated/prisma/enums';
import { ActingUser } from './ActingUser';

export class DeleteListingUseCase {
  constructor(private readonly listingRepository: ListingRepository) {}

  async execute(id: string, actingUser: ActingUser): Promise<void> {
    const listing = await this.listingRepository.findById(id);
    if (!listing) {
      throw new ListingNotFoundError(id);
    }

    if (actingUser.role !== UserRole.SUPERADMIN && listing.sellerId !== actingUser.id) {
      throw new ForbiddenListingActionError();
    }

    const deleted = await this.listingRepository.delete(id);
    if (!deleted) {
      throw new ListingNotFoundError(id);
    }
  }
}

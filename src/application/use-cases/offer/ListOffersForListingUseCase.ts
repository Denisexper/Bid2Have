import { Offer } from '../../../domain/entities/Offer';
import { OfferRepository } from '../../../domain/repositories/OfferRepository';
import { ListingRepository } from '../../../domain/repositories/ListingRepository';
import { ListingNotFoundError } from '../../../domain/errors/listing/ListingNotFoundError';
import { ForbiddenOfferActionError } from '../../../domain/errors/offer/ForbiddenOfferActionError';
import { ActingUser } from '../../shared/ActingUser';
import { UserRole } from '../../../generated/prisma/enums';

export class ListOffersForListingUseCase {
  constructor(
    private readonly offerRepository: OfferRepository,
    private readonly listingRepository: ListingRepository,
  ) {}

  async execute(listingId: string, actingUser: ActingUser): Promise<Offer[]> {
    const listing = await this.listingRepository.findById(listingId);
    if (!listing) {
      throw new ListingNotFoundError(listingId);
    }

    if (actingUser.role !== UserRole.SUPERADMIN && listing.sellerId !== actingUser.id) {
      throw new ForbiddenOfferActionError();
    }

    return this.offerRepository.findByListingId(listingId);
  }
}

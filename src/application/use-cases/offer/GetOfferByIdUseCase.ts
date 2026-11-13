import { Offer } from '../../../domain/entities/Offer';
import { OfferRepository } from '../../../domain/repositories/OfferRepository';
import { ListingRepository } from '../../../domain/repositories/ListingRepository';
import { OfferNotFoundError } from '../../../domain/errors/offer/OfferNotFoundError';
import { ForbiddenOfferActionError } from '../../../domain/errors/offer/ForbiddenOfferActionError';
import { ActingUser } from '../../shared/ActingUser';
import { OfferStatus, UserRole } from '../../../generated/prisma/enums';

export class GetOfferByIdUseCase {
  constructor(
    private readonly offerRepository: OfferRepository,
    private readonly listingRepository: ListingRepository,
  ) {}

  async execute(id: string, actingUser: ActingUser): Promise<Offer> {
    const offer = await this.offerRepository.findById(id);
    if (!offer) {
      throw new OfferNotFoundError(id);
    }

    if (actingUser.role !== UserRole.SUPERADMIN && offer.buyerId !== actingUser.id) {
      const listing = await this.listingRepository.findById(offer.listingId);
      if (listing?.sellerId !== actingUser.id) {
        throw new ForbiddenOfferActionError();
      }
    }

    return this.resolveLatest(offer);
  }

  // A counter-offer creates a new row (see CounterOfferUseCase); walk the chain so
  // callers tracking the original offer id always land on the one that's actionable.
  private async resolveLatest(offer: Offer): Promise<Offer> {
    if (offer.status !== OfferStatus.COUNTERED) {
      return offer;
    }

    const counterOffer = await this.offerRepository.findByParentOfferId(offer.id);
    if (!counterOffer) {
      return offer;
    }

    return this.resolveLatest(counterOffer);
  }
}

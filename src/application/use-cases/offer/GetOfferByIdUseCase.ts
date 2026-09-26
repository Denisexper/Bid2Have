import { Offer } from '../../../domain/entities/Offer';
import { OfferRepository } from '../../../domain/repositories/OfferRepository';
import { ListingRepository } from '../../../domain/repositories/ListingRepository';
import { OfferNotFoundError } from '../../../domain/errors/offer/OfferNotFoundError';
import { ForbiddenOfferActionError } from '../../../domain/errors/offer/ForbiddenOfferActionError';
import { ActingUser } from '../../shared/ActingUser';
import { UserRole } from '../../../generated/prisma/enums';

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

    if (actingUser.role === UserRole.SUPERADMIN || offer.buyerId === actingUser.id) {
      return offer;
    }

    const listing = await this.listingRepository.findById(offer.listingId);
    if (listing?.sellerId === actingUser.id) {
      return offer;
    }

    throw new ForbiddenOfferActionError();
  }
}

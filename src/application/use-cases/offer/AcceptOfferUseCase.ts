import { Offer } from '../../../domain/entities/Offer';
import { OfferRepository } from '../../../domain/repositories/OfferRepository';
import { ListingRepository } from '../../../domain/repositories/ListingRepository';
import { ChatRepository } from '../../../domain/repositories/ChatRepository';
import { OfferNotFoundError } from '../../../domain/errors/offer/OfferNotFoundError';
import { ForbiddenOfferActionError } from '../../../domain/errors/offer/ForbiddenOfferActionError';
import { InvalidOfferStateError } from '../../../domain/errors/offer/InvalidOfferStateError';
import { ActingUser } from '../../shared/ActingUser';
import { ListingStatus, OfferStatus, UserRole } from '../../../generated/prisma/enums';

export class AcceptOfferUseCase {
  constructor(
    private readonly offerRepository: OfferRepository,
    private readonly listingRepository: ListingRepository,
    private readonly chatRepository: ChatRepository,
  ) {}

  async execute(id: string, actingUser: ActingUser): Promise<Offer> {
    const offer = await this.offerRepository.findById(id);
    if (!offer) {
      throw new OfferNotFoundError(id);
    }

    const listing = await this.listingRepository.findById(offer.listingId);
    if (!listing) {
      throw new OfferNotFoundError(id);
    }

    if (actingUser.role !== UserRole.SUPERADMIN && listing.sellerId !== actingUser.id) {
      throw new ForbiddenOfferActionError();
    }

    if (offer.status !== OfferStatus.PENDING) {
      throw new InvalidOfferStateError('Only pending offers can be accepted');
    }

    const accepted = await this.offerRepository.updateStatus(id, OfferStatus.ACCEPTED);
    if (!accepted) {
      throw new OfferNotFoundError(id);
    }

    await this.offerRepository.rejectPendingExcept(offer.listingId, id);
    await this.listingRepository.updateById(offer.listingId, { status: ListingStatus.RESERVED });

    await this.chatRepository.create({
      listingId: offer.listingId,
      offerId: accepted.id,
      buyerId: accepted.buyerId,
      sellerId: listing.sellerId,
    });

    return accepted;
  }
}

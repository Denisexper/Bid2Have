import { Offer } from '../../../domain/entities/Offer';
import { OfferRepository } from '../../../domain/repositories/OfferRepository';
import { ListingRepository } from '../../../domain/repositories/ListingRepository';
import { NotificationRepository } from '../../../domain/repositories/NotificationRepository';
import { OfferNotFoundError } from '../../../domain/errors/offer/OfferNotFoundError';
import { ForbiddenOfferActionError } from '../../../domain/errors/offer/ForbiddenOfferActionError';
import { InvalidOfferStateError } from '../../../domain/errors/offer/InvalidOfferStateError';
import { InvalidOfferAmountError } from '../../../domain/errors/offer/InvalidOfferAmountError';
import { ActingUser } from '../../shared/ActingUser';
import { NotificationType, OfferStatus, UserRole } from '../../../generated/prisma/enums';

export class CounterOfferUseCase {
  constructor(
    private readonly offerRepository: OfferRepository,
    private readonly listingRepository: ListingRepository,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(id: string, amount: number, actingUser: ActingUser): Promise<Offer> {
    if (amount <= 0) {
      throw new InvalidOfferAmountError('Amount must be greater than zero');
    }

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
      throw new InvalidOfferStateError('Only pending offers can be countered');
    }

    await this.offerRepository.updateStatus(id, OfferStatus.COUNTERED);

    const counterOffer = await this.offerRepository.create({
      listingId: offer.listingId,
      buyerId: offer.buyerId,
      amount,
      parentOfferId: offer.id,
    });

    await this.notificationRepository.create({
      userId: offer.buyerId,
      type: NotificationType.OFFER_COUNTERED,
      payload: { listingId: offer.listingId, offerId: counterOffer.id, parentOfferId: offer.id, amount },
    });

    return counterOffer;
  }
}

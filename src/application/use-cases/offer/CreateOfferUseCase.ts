import { Offer } from '../../../domain/entities/Offer';
import { OfferRepository } from '../../../domain/repositories/OfferRepository';
import { ListingRepository } from '../../../domain/repositories/ListingRepository';
import { ListingNotFoundError } from '../../../domain/errors/listing/ListingNotFoundError';
import { CannotOfferOnOwnListingError } from '../../../domain/errors/offer/CannotOfferOnOwnListingError';
import { ListingNotAvailableError } from '../../../domain/errors/offer/ListingNotAvailableError';
import { InvalidOfferAmountError } from '../../../domain/errors/offer/InvalidOfferAmountError';
import { ListingStatus, SaleMode } from '../../../generated/prisma/enums';

export interface CreateOfferRequest {
  listingId: string;
  buyerId: string;
  amount: number;
}

export class CreateOfferUseCase {
  constructor(
    private readonly offerRepository: OfferRepository,
    private readonly listingRepository: ListingRepository,
  ) {}

  async execute(request: CreateOfferRequest): Promise<Offer> {
    const listing = await this.listingRepository.findById(request.listingId);
    if (!listing) {
      throw new ListingNotFoundError(request.listingId);
    }

    if (listing.status !== ListingStatus.ACTIVE) {
      throw new ListingNotAvailableError('This listing is not accepting offers');
    }

    if (listing.sellerId === request.buyerId) {
      throw new CannotOfferOnOwnListingError();
    }

    if (request.amount <= 0) {
      throw new InvalidOfferAmountError('Amount must be greater than zero');
    }

    if (listing.saleMode === SaleMode.AUCTION) {
      if (listing.auctionEndAt && listing.auctionEndAt.getTime() <= Date.now()) {
        throw new ListingNotAvailableError('This auction has already closed');
      }

      const highestPending = await this.offerRepository.findHighestPendingAmountByListingId(request.listingId);
      const minimumAmount = highestPending ?? listing.price;
      if (request.amount <= minimumAmount) {
        throw new InvalidOfferAmountError(`Amount must be greater than the current highest bid (${minimumAmount})`);
      }
    }

    return this.offerRepository.create({
      listingId: request.listingId,
      buyerId: request.buyerId,
      amount: request.amount,
    });
  }
}

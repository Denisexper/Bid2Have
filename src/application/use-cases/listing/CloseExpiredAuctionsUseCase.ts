import { ListingRepository } from '../../../domain/repositories/ListingRepository';
import { OfferRepository } from '../../../domain/repositories/OfferRepository';
import { ChatRepository } from '../../../domain/repositories/ChatRepository';
import { ListingStatus, OfferStatus } from '../../../generated/prisma/enums';

export interface ClosedAuctionResult {
  listingId: string;
  status: 'RESERVED' | 'CANCELLED';
  acceptedOfferId: string | null;
}

export class CloseExpiredAuctionsUseCase {
  constructor(
    private readonly listingRepository: ListingRepository,
    private readonly offerRepository: OfferRepository,
    private readonly chatRepository: ChatRepository,
  ) {}

  async execute(now: Date = new Date()): Promise<ClosedAuctionResult[]> {
    const expiredListings = await this.listingRepository.findExpiredActiveAuctions(now);
    const results: ClosedAuctionResult[] = [];

    for (const listing of expiredListings) {
      const winningOffer = await this.offerRepository.findHighestPendingOfferByListingId(listing.id);

      if (!winningOffer) {
        await this.listingRepository.updateById(listing.id, { status: ListingStatus.CANCELLED });
        results.push({ listingId: listing.id, status: ListingStatus.CANCELLED, acceptedOfferId: null });
        continue;
      }

      await this.offerRepository.updateStatus(winningOffer.id, OfferStatus.ACCEPTED);
      await this.offerRepository.rejectPendingExcept(listing.id, winningOffer.id);
      await this.listingRepository.updateById(listing.id, { status: ListingStatus.RESERVED });
      await this.chatRepository.create({
        listingId: listing.id,
        offerId: winningOffer.id,
        buyerId: winningOffer.buyerId,
        sellerId: listing.sellerId,
      });

      results.push({ listingId: listing.id, status: ListingStatus.RESERVED, acceptedOfferId: winningOffer.id });
    }

    return results;
  }
}

import { Rating } from '../../../domain/entities/Rating';
import { RatingRepository } from '../../../domain/repositories/RatingRepository';
import { OfferRepository } from '../../../domain/repositories/OfferRepository';
import { ListingRepository } from '../../../domain/repositories/ListingRepository';
import { OfferNotFoundError } from '../../../domain/errors/offer/OfferNotFoundError';
import { ForbiddenRatingActionError } from '../../../domain/errors/rating/ForbiddenRatingActionError';
import { InvalidRatingStateError } from '../../../domain/errors/rating/InvalidRatingStateError';
import { InvalidRatingScoreError } from '../../../domain/errors/rating/InvalidRatingScoreError';
import { RatingAlreadyExistsError } from '../../../domain/errors/rating/RatingAlreadyExistsError';
import { OfferStatus } from '../../../generated/prisma/enums';

export interface RateOfferRequest {
  offerId: string;
  raterId: string;
  score: number;
  comment?: string | null;
}

export class RateOfferUseCase {
  constructor(
    private readonly ratingRepository: RatingRepository,
    private readonly offerRepository: OfferRepository,
    private readonly listingRepository: ListingRepository,
  ) {}

  async execute(request: RateOfferRequest): Promise<Rating> {
    const offer = await this.offerRepository.findById(request.offerId);
    if (!offer) {
      throw new OfferNotFoundError(request.offerId);
    }

    const listing = await this.listingRepository.findById(offer.listingId);
    if (!listing) {
      throw new OfferNotFoundError(request.offerId);
    }

    if (offer.status !== OfferStatus.ACCEPTED) {
      throw new InvalidRatingStateError('Only accepted offers can be rated');
    }

    const buyerId = offer.buyerId;
    const sellerId = listing.sellerId;

    if (request.raterId !== buyerId && request.raterId !== sellerId) {
      throw new ForbiddenRatingActionError();
    }

    if (!Number.isInteger(request.score) || request.score < 1 || request.score > 5) {
      throw new InvalidRatingScoreError('Score must be an integer between 1 and 5');
    }

    const existing = await this.ratingRepository.findByOfferAndRater(request.offerId, request.raterId);
    if (existing) {
      throw new RatingAlreadyExistsError();
    }

    const ratedUserId = request.raterId === buyerId ? sellerId : buyerId;

    return this.ratingRepository.create({
      offerId: request.offerId,
      raterId: request.raterId,
      ratedUserId,
      score: request.score,
      comment: request.comment ?? null,
    });
  }
}

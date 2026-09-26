import { Rating } from '../entities/Rating';

export interface CreateRatingInput {
  offerId: string;
  raterId: string;
  ratedUserId: string;
  score: number;
  comment?: string | null;
}

export interface RatingRepository {
  create(input: CreateRatingInput): Promise<Rating>;
  findByOfferAndRater(offerId: string, raterId: string): Promise<Rating | null>;
  findByRatedUserId(ratedUserId: string): Promise<Rating[]>;
  getAverageScoreForUser(ratedUserId: string): Promise<number | null>;
}

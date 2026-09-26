import { Rating } from '../../../domain/entities/Rating';
import { RatingRepository } from '../../../domain/repositories/RatingRepository';

export interface UserRatingsSummary {
  average: number | null;
  ratings: Rating[];
}

export class ListRatingsForUserUseCase {
  constructor(private readonly ratingRepository: RatingRepository) {}

  async execute(userId: string): Promise<UserRatingsSummary> {
    const [ratings, average] = await Promise.all([
      this.ratingRepository.findByRatedUserId(userId),
      this.ratingRepository.getAverageScoreForUser(userId),
    ]);

    return { average, ratings };
  }
}

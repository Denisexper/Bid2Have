import { PrismaClient } from '../../../generated/prisma/client';
import { Rating } from '../../../domain/entities/Rating';
import { CreateRatingInput, RatingRepository } from '../../../domain/repositories/RatingRepository';

type PrismaRating = Awaited<ReturnType<PrismaClient['rating']['findUniqueOrThrow']>>;

function toDomain(rating: PrismaRating): Rating {
  return { ...rating };
}

export class PrismaRatingRepository implements RatingRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(input: CreateRatingInput): Promise<Rating> {
    const rating = await this.prisma.rating.create({ data: input });
    return toDomain(rating);
  }

  async findByOfferAndRater(offerId: string, raterId: string): Promise<Rating | null> {
    const rating = await this.prisma.rating.findFirst({ where: { offerId, raterId } });
    return rating ? toDomain(rating) : null;
  }

  async findByRatedUserId(ratedUserId: string): Promise<Rating[]> {
    const ratings = await this.prisma.rating.findMany({
      where: { ratedUserId },
      orderBy: { createdAt: 'desc' },
    });
    return ratings.map(toDomain);
  }

  async getAverageScoreForUser(ratedUserId: string): Promise<number | null> {
    const result = await this.prisma.rating.aggregate({
      where: { ratedUserId },
      _avg: { score: true },
    });
    return result._avg.score;
  }
}

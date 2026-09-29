import { PrismaClient } from '../../../generated/prisma/client';
import { Follow } from '../../../domain/entities/Follow';
import { CreateFollowInput, FollowRepository } from '../../../domain/repositories/FollowRepository';

type PrismaFollow = Awaited<ReturnType<PrismaClient['follow']['findUniqueOrThrow']>>;

function toDomain(follow: PrismaFollow): Follow {
  return { ...follow };
}

export class PrismaFollowRepository implements FollowRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(input: CreateFollowInput): Promise<Follow> {
    const follow = await this.prisma.follow.create({ data: input });
    return toDomain(follow);
  }

  async findByFollowerAndFollowing(followerId: string, followingId: string): Promise<Follow | null> {
    const follow = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });
    return follow ? toDomain(follow) : null;
  }

  async findFollowingByFollowerId(followerId: string): Promise<Follow[]> {
    const follows = await this.prisma.follow.findMany({
      where: { followerId },
      orderBy: { createdAt: 'desc' },
    });
    return follows.map(toDomain);
  }

  async findFollowersByFollowingId(followingId: string): Promise<Follow[]> {
    const follows = await this.prisma.follow.findMany({
      where: { followingId },
      orderBy: { createdAt: 'desc' },
    });
    return follows.map(toDomain);
  }

  async delete(followerId: string, followingId: string): Promise<void> {
    await this.prisma.follow
      .delete({ where: { followerId_followingId: { followerId, followingId } } })
      .catch(() => undefined);
  }
}

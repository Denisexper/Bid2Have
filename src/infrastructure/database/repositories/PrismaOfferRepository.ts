import { PrismaClient } from '../../../generated/prisma/client';
import { OfferStatus } from '../../../generated/prisma/enums';
import { Offer } from '../../../domain/entities/Offer';
import { CreateOfferInput, OfferRepository } from '../../../domain/repositories/OfferRepository';

type PrismaOffer = Awaited<ReturnType<PrismaClient['offer']['findUniqueOrThrow']>>;

function toDomain(offer: PrismaOffer): Offer {
  return {
    ...offer,
    amount: offer.amount.toNumber(),
  };
}

export class PrismaOfferRepository implements OfferRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(input: CreateOfferInput): Promise<Offer> {
    const offer = await this.prisma.offer.create({ data: input });
    return toDomain(offer);
  }

  async findById(id: string): Promise<Offer | null> {
    const offer = await this.prisma.offer.findUnique({ where: { id } });
    return offer ? toDomain(offer) : null;
  }

  async findByListingId(listingId: string): Promise<Offer[]> {
    const offers = await this.prisma.offer.findMany({ where: { listingId } });
    return offers.map(toDomain);
  }

  async findHighestPendingAmountByListingId(listingId: string): Promise<number | null> {
    const result = await this.prisma.offer.aggregate({
      where: { listingId, status: OfferStatus.PENDING },
      _max: { amount: true },
    });
    return result._max.amount ? result._max.amount.toNumber() : null;
  }

  async updateStatus(id: string, status: OfferStatus): Promise<Offer | null> {
    const existing = await this.prisma.offer.findUnique({ where: { id } });
    if (!existing) {
      return null;
    }
    const updated = await this.prisma.offer.update({ where: { id }, data: { status } });
    return toDomain(updated);
  }

  async rejectPendingExcept(listingId: string, exceptOfferId: string): Promise<void> {
    await this.prisma.offer.updateMany({
      where: { listingId, status: OfferStatus.PENDING, id: { not: exceptOfferId } },
      data: { status: OfferStatus.REJECTED },
    });
  }
}

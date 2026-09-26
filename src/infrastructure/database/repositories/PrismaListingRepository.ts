import { PrismaClient } from '../../../generated/prisma/client';
import { ListingStatus, SaleMode } from '../../../generated/prisma/enums';
import { Listing } from '../../../domain/entities/Listing';
import {
  CreateListingInput,
  ListingRepository,
  UpdateListingInput,
} from '../../../domain/repositories/ListingRepository';

type PrismaListing = Awaited<ReturnType<PrismaClient['listing']['findUniqueOrThrow']>>;

function toDomain(listing: PrismaListing): Listing {
  return {
    ...listing,
    price: listing.price.toNumber(),
  };
}

export class PrismaListingRepository implements ListingRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(input: CreateListingInput): Promise<Listing> {
    const listing = await this.prisma.listing.create({ data: input });
    return toDomain(listing);
  }

  async findAll(): Promise<Listing[]> {
    const listings = await this.prisma.listing.findMany();
    return listings.map(toDomain);
  }

  async findById(id: string): Promise<Listing | null> {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    return listing ? toDomain(listing) : null;
  }

  async updateById(id: string, input: UpdateListingInput): Promise<Listing | null> {
    const existing = await this.prisma.listing.findUnique({ where: { id } });
    if (!existing) {
      return null;
    }
    const updated = await this.prisma.listing.update({ where: { id }, data: input });
    return toDomain(updated);
  }

  async delete(id: string): Promise<Listing | null> {
    const existing = await this.prisma.listing.findUnique({ where: { id } });
    if (!existing) {
      return null;
    }
    const deleted = await this.prisma.listing.delete({ where: { id } });
    return toDomain(deleted);
  }

  async findExpiredActiveAuctions(now: Date): Promise<Listing[]> {
    const listings = await this.prisma.listing.findMany({
      where: {
        saleMode: SaleMode.AUCTION,
        status: ListingStatus.ACTIVE,
        auctionEndAt: { lte: now },
      },
    });
    return listings.map(toDomain);
  }
}

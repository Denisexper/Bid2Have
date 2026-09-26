import { Offer } from '../entities/Offer';
import { OfferStatus } from '../../generated/prisma/enums';

export interface CreateOfferInput {
  listingId: string;
  buyerId: string;
  amount: number;
  parentOfferId?: string | null;
}

export interface OfferRepository {
  create(input: CreateOfferInput): Promise<Offer>;
  findById(id: string): Promise<Offer | null>;
  findByListingId(listingId: string): Promise<Offer[]>;
  findHighestPendingAmountByListingId(listingId: string): Promise<number | null>;
  findHighestPendingOfferByListingId(listingId: string): Promise<Offer | null>;
  updateStatus(id: string, status: OfferStatus): Promise<Offer | null>;
  rejectPendingExcept(listingId: string, exceptOfferId: string): Promise<void>;
}

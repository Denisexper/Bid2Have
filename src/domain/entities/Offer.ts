import { OfferStatus } from '../../generated/prisma/enums';

export interface Offer {
  id: string;
  listingId: string;
  buyerId: string;
  amount: number;
  status: OfferStatus;
  parentOfferId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

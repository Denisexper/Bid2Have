import { ListingCondition, ListingStatus, SaleMode } from '../../generated/prisma/enums';

export interface Listing {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  categoryId: string;
  condition: ListingCondition;
  price: number;
  currency: string;
  photos: string[];
  lat: number;
  lng: number;
  saleMode: SaleMode;
  auctionEndAt: Date | null;
  status: ListingStatus;
  createdAt: Date;
  updatedAt: Date;
}

import { Listing } from '../entities/Listing';
import { ListingCondition, ListingStatus, SaleMode } from '../../generated/prisma/enums';

export interface CreateListingInput {
  sellerId: string;
  title: string;
  description: string;
  categoryId: string;
  condition: ListingCondition;
  price: number;
  currency?: string;
  photos: string[];
  lat: number;
  lng: number;
  saleMode: SaleMode;
  auctionEndAt?: Date | null;
}

export interface UpdateListingInput {
  title?: string;
  description?: string;
  categoryId?: string;
  condition?: ListingCondition;
  price?: number;
  currency?: string;
  photos?: string[];
  lat?: number;
  lng?: number;
  saleMode?: SaleMode;
  auctionEndAt?: Date | null;
  status?: ListingStatus;
}

export interface ListingRepository {
  create(input: CreateListingInput): Promise<Listing>;
  findAll(): Promise<Listing[]>;
  findById(id: string): Promise<Listing | null>;
  updateById(id: string, input: UpdateListingInput): Promise<Listing | null>;
  delete(id: string): Promise<Listing | null>;
  findExpiredActiveAuctions(now: Date): Promise<Listing[]>;
}

import { Listing } from '../../../domain/entities/Listing';
import { ListingRepository } from '../../../domain/repositories/ListingRepository';
import { haversineDistanceKm } from '../../../shared/utils/geo';

export interface ListingWithDistance extends Listing {
  distanceKm: number;
}

export interface SearchListingsNearbyInput {
  lat: number;
  lng: number;
  radiusKm?: number;
}

export class SearchListingsNearbyUseCase {
  constructor(private readonly listingRepository: ListingRepository) {}

  async execute(input: SearchListingsNearbyInput): Promise<ListingWithDistance[]> {
    const { lat, lng, radiusKm } = input;
    const listings = await this.listingRepository.findAll();

    const withDistance = listings.map((listing) => ({
      ...listing,
      distanceKm: haversineDistanceKm(lat, lng, listing.lat, listing.lng),
    }));

    const inRadius =
      radiusKm !== undefined ? withDistance.filter((listing) => listing.distanceKm <= radiusKm) : withDistance;

    return inRadius.sort((a, b) => a.distanceKm - b.distanceKm);
  }
}

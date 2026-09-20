import { Listing } from '../../../domain/entities/Listing';
import { ListingRepository } from '../../../domain/repositories/ListingRepository';
import { ListingNotFoundError } from '../../../domain/errors/listing/ListingNotFoundError';

export class GetListingByIdUseCase {
  constructor(private readonly listingRepository: ListingRepository) {}

  async execute(id: string): Promise<Listing> {
    const listing = await this.listingRepository.findById(id);
    if (!listing) {
      throw new ListingNotFoundError(id);
    }

    return listing;
  }
}

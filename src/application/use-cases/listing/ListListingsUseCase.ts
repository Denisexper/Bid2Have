import { Listing } from '../../../domain/entities/Listing';
import { ListingRepository } from '../../../domain/repositories/ListingRepository';

export class ListListingsUseCase {
  constructor(private readonly listingRepository: ListingRepository) {}

  async execute(): Promise<Listing[]> {
    return this.listingRepository.findAll();
  }
}

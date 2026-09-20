import { Listing } from '../../../domain/entities/Listing';
import { CreateListingInput, ListingRepository } from '../../../domain/repositories/ListingRepository';
import { CategoryRepository } from '../../../domain/repositories/CategoryRepository';
import { CategoryNotFoundError } from '../../../domain/errors/category/CategoryNotFoundError';

export class CreateListingUseCase {
  constructor(
    private readonly listingRepository: ListingRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(input: CreateListingInput): Promise<Listing> {
    const category = await this.categoryRepository.findById(input.categoryId);
    if (!category) {
      throw new CategoryNotFoundError(input.categoryId);
    }

    return this.listingRepository.create(input);
  }
}

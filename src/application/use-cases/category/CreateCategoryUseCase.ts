import { Category } from '../../../domain/entities/Category';
import { CategoryRepository, CreateCategoryInput } from '../../../domain/repositories/CategoryRepository';
import { CategoryAlreadyExistsError } from '../../../domain/errors/category/CategoryAlreadyExistsError';

export class CreateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: CreateCategoryInput): Promise<Category> {
    const existing = await this.categoryRepository.findBySlug(input.slug);
    if (existing) {
      throw new CategoryAlreadyExistsError(input.slug);
    }

    return this.categoryRepository.create(input);
  }
}

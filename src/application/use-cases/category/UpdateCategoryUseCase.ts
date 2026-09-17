import { Category } from '../../../domain/entities/Category';
import { CategoryRepository, UpdateCategoryInput } from '../../../domain/repositories/CategoryRepository';
import { CategoryNotFoundError } from '../../../domain/errors/category/CategoryNotFoundError';
import { CategoryAlreadyExistsError } from '../../../domain/errors/category/CategoryAlreadyExistsError';

export class UpdateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(id: string, input: UpdateCategoryInput): Promise<Category> {
    if (input.slug) {
      const existing = await this.categoryRepository.findBySlug(input.slug);
      if (existing && existing.id !== id) {
        throw new CategoryAlreadyExistsError(input.slug);
      }
    }

    const updated = await this.categoryRepository.updateById(id, input);
    if (!updated) {
      throw new CategoryNotFoundError(id);
    }

    return updated;
  }
}

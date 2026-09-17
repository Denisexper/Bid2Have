import { CategoryRepository } from '../../../domain/repositories/CategoryRepository';
import { CategoryNotFoundError } from '../../../domain/errors/category/CategoryNotFoundError';

export class DeleteCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.categoryRepository.delete(id);
    if (!deleted) {
      throw new CategoryNotFoundError(id);
    }
  }
}

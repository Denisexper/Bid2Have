import { Category } from '../../../domain/entities/Category';
import { CategoryRepository } from '../../../domain/repositories/CategoryRepository';

export class ListCategoriesUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(): Promise<Category[]> {
    return this.categoryRepository.finAll();
  }
}

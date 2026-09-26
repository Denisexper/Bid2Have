import { Category } from '../entities/Category';

export interface CreateCategoryInput {
  name: string;
  slug: string;
}

export interface UpdateCategoryInput {
    name?: string;
    slug?: string;
}

export interface CategoryRepository {
    create(input: CreateCategoryInput): Promise<Category>;
    findBySlug(slug: string): Promise<Category | null>;
    finAll(): Promise<Category[]>;
    findById(id: string): Promise<Category | null>;
    updateById(id: string, input: UpdateCategoryInput): Promise<Category | null>;
    delete(id: string): Promise<Category | null>;
}
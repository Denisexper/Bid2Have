export class CategoryAlreadyExistsError extends Error {
  constructor(slug: string) {
    super(`Category with slug '${slug}' already exists`);
    this.name = 'CategoryAlreadyExistsError';
  }
}

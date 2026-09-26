export class ListingNotFoundError extends Error {
  constructor(id: string) {
    super(`Listing with id ${id} not found`);
    this.name = 'ListingNotFoundError';
  }
}

export class OfferNotFoundError extends Error {
  constructor(id: string) {
    super(`Offer with id ${id} not found`);
    this.name = 'OfferNotFoundError';
  }
}

export class ListingNotAvailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ListingNotAvailableError';
  }
}

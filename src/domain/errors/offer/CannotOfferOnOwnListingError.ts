export class CannotOfferOnOwnListingError extends Error {
  constructor() {
    super('You cannot make an offer on your own listing');
    this.name = 'CannotOfferOnOwnListingError';
  }
}

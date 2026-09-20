export class ForbiddenOfferActionError extends Error {
  constructor() {
    super('You do not have permission to perform this action on this offer');
    this.name = 'ForbiddenOfferActionError';
  }
}

export class ForbiddenListingActionError extends Error {
  constructor() {
    super('You do not have permission to modify this listing');
    this.name = 'ForbiddenListingActionError';
  }
}

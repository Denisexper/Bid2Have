export class ForbiddenRatingActionError extends Error {
  constructor() {
    super('You do not have permission to perform this action on this rating');
    this.name = 'ForbiddenRatingActionError';
  }
}

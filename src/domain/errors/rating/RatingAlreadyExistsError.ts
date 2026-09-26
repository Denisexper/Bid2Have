export class RatingAlreadyExistsError extends Error {
  constructor() {
    super('You have already rated this offer');
    this.name = 'RatingAlreadyExistsError';
  }
}

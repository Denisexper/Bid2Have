export class InvalidRatingStateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidRatingStateError';
  }
}

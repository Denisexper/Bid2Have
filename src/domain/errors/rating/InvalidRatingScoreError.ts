export class InvalidRatingScoreError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidRatingScoreError';
  }
}

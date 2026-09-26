export class InvalidOfferStateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidOfferStateError';
  }
}

export class InvalidOfferAmountError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidOfferAmountError';
  }
}

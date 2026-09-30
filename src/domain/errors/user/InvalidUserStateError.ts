export class InvalidUserStateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidUserStateError';
  }
}

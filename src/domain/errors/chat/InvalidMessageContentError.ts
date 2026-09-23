export class InvalidMessageContentError extends Error {
  constructor(message = 'Message content must not be empty') {
    super(message);
    this.name = 'InvalidMessageContentError';
  }
}

export class InvalidGoogleTokenError extends Error {
  constructor() {
    super('Invalid or expired Google ID token');
    this.name = 'InvalidGoogleTokenError';
  }
}

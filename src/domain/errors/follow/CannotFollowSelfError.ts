export class CannotFollowSelfError extends Error {
  constructor() {
    super('You cannot follow yourself');
    this.name = 'CannotFollowSelfError';
  }
}

export class NotFollowingError extends Error {
  constructor() {
    super('You are not following this user');
    this.name = 'NotFollowingError';
  }
}

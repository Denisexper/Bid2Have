export class AlreadyFollowingError extends Error {
  constructor() {
    super('You are already following this user');
    this.name = 'AlreadyFollowingError';
  }
}

export class ForbiddenNotificationActionError extends Error {
  constructor() {
    super('You do not have permission to perform this action on this notification');
    this.name = 'ForbiddenNotificationActionError';
  }
}

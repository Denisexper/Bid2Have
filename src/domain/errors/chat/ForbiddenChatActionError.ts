export class ForbiddenChatActionError extends Error {
  constructor() {
    super('You do not have permission to access this chat');
    this.name = 'ForbiddenChatActionError';
  }
}

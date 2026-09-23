export class ChatNotFoundError extends Error {
  constructor(id: string) {
    super(`Chat with id ${id} not found`);
    this.name = 'ChatNotFoundError';
  }
}

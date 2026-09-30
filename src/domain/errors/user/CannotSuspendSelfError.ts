export class CannotSuspendSelfError extends Error {
  constructor() {
    super('You cannot suspend your own account');
    this.name = 'CannotSuspendSelfError';
  }
}

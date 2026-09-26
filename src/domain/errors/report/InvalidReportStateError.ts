export class InvalidReportStateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidReportStateError';
  }
}

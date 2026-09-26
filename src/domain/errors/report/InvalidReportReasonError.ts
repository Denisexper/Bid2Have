export class InvalidReportReasonError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidReportReasonError';
  }
}

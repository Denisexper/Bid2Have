export class InvalidReportTargetError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidReportTargetError';
  }
}

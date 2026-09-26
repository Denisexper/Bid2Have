export class ReportTargetNotFoundError extends Error {
  constructor() {
    super('The listing or user being reported was not found');
    this.name = 'ReportTargetNotFoundError';
  }
}

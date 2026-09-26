export class ReportNotFoundError extends Error {
  constructor(id: string) {
    super(`Report with id ${id} not found`);
    this.name = 'ReportNotFoundError';
  }
}

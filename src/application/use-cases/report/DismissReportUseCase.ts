import { Report } from '../../../domain/entities/Report';
import { ReportRepository } from '../../../domain/repositories/ReportRepository';
import { ReportNotFoundError } from '../../../domain/errors/report/ReportNotFoundError';
import { InvalidReportStateError } from '../../../domain/errors/report/InvalidReportStateError';
import { ReportStatus } from '../../../generated/prisma/enums';

export class DismissReportUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  async execute(id: string): Promise<Report> {
    const report = await this.reportRepository.findById(id);
    if (!report) {
      throw new ReportNotFoundError(id);
    }

    if (report.status !== ReportStatus.PENDING) {
      throw new InvalidReportStateError('Only pending reports can be dismissed');
    }

    const updated = await this.reportRepository.updateStatus(id, ReportStatus.DISMISSED);
    if (!updated) {
      throw new ReportNotFoundError(id);
    }

    return updated;
  }
}

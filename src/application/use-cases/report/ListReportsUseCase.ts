import { Report } from '../../../domain/entities/Report';
import { ReportRepository } from '../../../domain/repositories/ReportRepository';
import { ReportStatus } from '../../../generated/prisma/enums';

export class ListReportsUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  async execute(status?: ReportStatus): Promise<Report[]> {
    return this.reportRepository.findAll(status);
  }
}

import { PrismaClient } from '../../../generated/prisma/client';
import { ReportStatus } from '../../../generated/prisma/enums';
import { Report } from '../../../domain/entities/Report';
import { CreateReportInput, ReportRepository } from '../../../domain/repositories/ReportRepository';

type PrismaReport = Awaited<ReturnType<PrismaClient['report']['findUniqueOrThrow']>>;

function toDomain(report: PrismaReport): Report {
  return { ...report };
}

export class PrismaReportRepository implements ReportRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(input: CreateReportInput): Promise<Report> {
    const report = await this.prisma.report.create({ data: input });
    return toDomain(report);
  }

  async findById(id: string): Promise<Report | null> {
    const report = await this.prisma.report.findUnique({ where: { id } });
    return report ? toDomain(report) : null;
  }

  async findAll(status?: ReportStatus): Promise<Report[]> {
    const reports = await this.prisma.report.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    return reports.map(toDomain);
  }

  async updateStatus(id: string, status: ReportStatus): Promise<Report | null> {
    const report = await this.prisma.report
      .update({ where: { id }, data: { status } })
      .catch(() => null);
    return report ? toDomain(report) : null;
  }
}

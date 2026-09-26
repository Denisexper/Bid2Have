import { Report } from '../entities/Report';
import { ReportStatus, ReportTargetType } from '../../generated/prisma/enums';

export interface CreateReportInput {
  reporterId: string;
  targetType: ReportTargetType;
  listingId?: string | null;
  targetUserId?: string | null;
  reason: string;
  description?: string | null;
}

export interface ReportRepository {
  create(input: CreateReportInput): Promise<Report>;
  findById(id: string): Promise<Report | null>;
  findAll(status?: ReportStatus): Promise<Report[]>;
  updateStatus(id: string, status: ReportStatus): Promise<Report | null>;
}

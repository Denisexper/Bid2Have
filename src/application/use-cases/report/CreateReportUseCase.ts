import { Report, REPORT_REASONS } from '../../../domain/entities/Report';
import { ReportRepository } from '../../../domain/repositories/ReportRepository';
import { ListingRepository } from '../../../domain/repositories/ListingRepository';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { InvalidReportReasonError } from '../../../domain/errors/report/InvalidReportReasonError';
import { InvalidReportTargetError } from '../../../domain/errors/report/InvalidReportTargetError';
import { ReportTargetNotFoundError } from '../../../domain/errors/report/ReportTargetNotFoundError';
import { ReportTargetType } from '../../../generated/prisma/enums';

export interface CreateReportRequest {
  reporterId: string;
  targetType: ReportTargetType;
  listingId?: string | null;
  targetUserId?: string | null;
  reason: string;
  description?: string | null;
}

export class CreateReportUseCase {
  constructor(
    private readonly reportRepository: ReportRepository,
    private readonly listingRepository: ListingRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(request: CreateReportRequest): Promise<Report> {
    if (!REPORT_REASONS.includes(request.reason as (typeof REPORT_REASONS)[number])) {
      throw new InvalidReportReasonError(`reason must be one of: ${REPORT_REASONS.join(', ')}`);
    }

    if (request.targetType === ReportTargetType.LISTING) {
      if (!request.listingId || request.targetUserId) {
        throw new InvalidReportTargetError(
          'listingId is required and targetUserId must not be set for LISTING reports',
        );
      }

      const listing = await this.listingRepository.findById(request.listingId);
      if (!listing) {
        throw new ReportTargetNotFoundError();
      }

      if (listing.sellerId === request.reporterId) {
        throw new InvalidReportTargetError('You cannot report your own listing');
      }

      return this.reportRepository.create({
        reporterId: request.reporterId,
        targetType: request.targetType,
        listingId: request.listingId,
        reason: request.reason,
        description: request.description ?? null,
      });
    }

    if (!request.targetUserId || request.listingId) {
      throw new InvalidReportTargetError('targetUserId is required and listingId must not be set for USER reports');
    }

    if (request.targetUserId === request.reporterId) {
      throw new InvalidReportTargetError('You cannot report yourself');
    }

    const targetUser = await this.userRepository.findById(request.targetUserId);
    if (!targetUser) {
      throw new ReportTargetNotFoundError();
    }

    return this.reportRepository.create({
      reporterId: request.reporterId,
      targetType: request.targetType,
      targetUserId: request.targetUserId,
      reason: request.reason,
      description: request.description ?? null,
    });
  }
}

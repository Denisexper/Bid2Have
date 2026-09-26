import { ReportStatus, ReportTargetType } from '../../generated/prisma/enums';

export const REPORT_REASONS = ['PROHIBITED_ITEM', 'FRAUD', 'INAPPROPRIATE_CONTENT', 'OTHER'] as const;

export type ReportReason = (typeof REPORT_REASONS)[number];

export interface Report {
  id: string;
  reporterId: string;
  targetType: ReportTargetType;
  listingId: string | null;
  targetUserId: string | null;
  reason: string;
  description: string | null;
  status: ReportStatus;
  createdAt: Date;
}

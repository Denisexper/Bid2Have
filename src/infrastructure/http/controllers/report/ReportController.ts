import { Request, Response } from 'express';
import { CreateReportUseCase } from '../../../../application/use-cases/report/CreateReportUseCase';
import { ListReportsUseCase } from '../../../../application/use-cases/report/ListReportsUseCase';
import { ReviewReportUseCase } from '../../../../application/use-cases/report/ReviewReportUseCase';
import { DismissReportUseCase } from '../../../../application/use-cases/report/DismissReportUseCase';
import { InvalidReportReasonError } from '../../../../domain/errors/report/InvalidReportReasonError';
import { InvalidReportTargetError } from '../../../../domain/errors/report/InvalidReportTargetError';
import { ReportTargetNotFoundError } from '../../../../domain/errors/report/ReportTargetNotFoundError';
import { ReportNotFoundError } from '../../../../domain/errors/report/ReportNotFoundError';
import { InvalidReportStateError } from '../../../../domain/errors/report/InvalidReportStateError';
import { ReportStatus, ReportTargetType } from '../../../../generated/prisma/enums';

export class ReportController {
  constructor(
    private readonly createReportUseCase: CreateReportUseCase,
    private readonly listReportsUseCase: ListReportsUseCase,
    private readonly reviewReportUseCase: ReviewReportUseCase,
    private readonly dismissReportUseCase: DismissReportUseCase,
  ) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const { targetType, listingId, targetUserId, reason, description } = req.body;

    if (!Object.values(ReportTargetType).includes(targetType)) {
      res.status(400).json({ message: `targetType must be one of: ${Object.values(ReportTargetType).join(', ')}` });
      return;
    }

    try {
      const report = await this.createReportUseCase.execute({
        reporterId: req.user!.id,
        targetType,
        listingId,
        targetUserId,
        reason,
        description,
      });
      res.status(201).json({ report });
    } catch (error) {
      if (error instanceof ReportTargetNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof InvalidReportReasonError || error instanceof InvalidReportTargetError) {
        res.status(400).json({ message: error.message });
        return;
      }
      throw error;
    }
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const { status } = req.query;

    if (status !== undefined && !Object.values(ReportStatus).includes(status as ReportStatus)) {
      res.status(400).json({ message: `status must be one of: ${Object.values(ReportStatus).join(', ')}` });
      return;
    }

    const reports = await this.listReportsUseCase.execute(status as ReportStatus | undefined);
    res.status(200).json({ reports });
  };

  review = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const report = await this.reviewReportUseCase.execute(id);
      res.status(200).json({ report });
    } catch (error) {
      if (error instanceof ReportNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof InvalidReportStateError) {
        res.status(409).json({ message: error.message });
        return;
      }
      throw error;
    }
  };

  dismiss = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const report = await this.dismissReportUseCase.execute(id);
      res.status(200).json({ report });
    } catch (error) {
      if (error instanceof ReportNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof InvalidReportStateError) {
        res.status(409).json({ message: error.message });
        return;
      }
      throw error;
    }
  };
}

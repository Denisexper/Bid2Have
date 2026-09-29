import { Router } from 'express';
import { prisma } from '../../database/prisma-client';
import { PrismaReportRepository } from '../../database/repositories/PrismaReportRepository';
import { PrismaListingRepository } from '../../database/repositories/PrismaListingRepository';
import { PrismaUserRepository } from '../../database/repositories/PrismaUserRepository';
import { CreateReportUseCase } from '../../../application/use-cases/report/CreateReportUseCase';
import { ListReportsUseCase } from '../../../application/use-cases/report/ListReportsUseCase';
import { ReviewReportUseCase } from '../../../application/use-cases/report/ReviewReportUseCase';
import { DismissReportUseCase } from '../../../application/use-cases/report/DismissReportUseCase';
import { ReportController } from '../controllers/report/ReportController';
import { authenticate } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const reportRepository = new PrismaReportRepository(prisma);
const listingRepository = new PrismaListingRepository(prisma);
const userRepository = new PrismaUserRepository(prisma);

const createReportUseCase = new CreateReportUseCase(reportRepository, listingRepository, userRepository);
const listReportsUseCase = new ListReportsUseCase(reportRepository);
const reviewReportUseCase = new ReviewReportUseCase(reportRepository);
const dismissReportUseCase = new DismissReportUseCase(reportRepository);

const reportController = new ReportController(
  createReportUseCase,
  listReportsUseCase,
  reviewReportUseCase,
  dismissReportUseCase,
);

export const reportRoutes = Router();

reportRoutes.post('/', authenticate, reportController.create);
reportRoutes.get('/', authenticate, requireRole('SUPERADMIN'), reportController.list);
reportRoutes.patch('/:id/review', authenticate, requireRole('SUPERADMIN'), reportController.review);
reportRoutes.patch('/:id/dismiss', authenticate, requireRole('SUPERADMIN'), reportController.dismiss);

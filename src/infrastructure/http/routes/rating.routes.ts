import { Router } from 'express';
import { prisma } from '../../database/prisma-client';
import { PrismaRatingRepository } from '../../database/repositories/PrismaRatingRepository';
import { PrismaOfferRepository } from '../../database/repositories/PrismaOfferRepository';
import { PrismaListingRepository } from '../../database/repositories/PrismaListingRepository';
import { RateOfferUseCase } from '../../../application/use-cases/rating/RateOfferUseCase';
import { ListRatingsForUserUseCase } from '../../../application/use-cases/rating/ListRatingsForUserUseCase';
import { RatingController } from '../controllers/rating/RatingController';
import { authenticate } from '../middlewares/authMiddleware';

const ratingRepository = new PrismaRatingRepository(prisma);
const offerRepository = new PrismaOfferRepository(prisma);
const listingRepository = new PrismaListingRepository(prisma);
const rateOfferUseCase = new RateOfferUseCase(ratingRepository, offerRepository, listingRepository);
const listRatingsForUserUseCase = new ListRatingsForUserUseCase(ratingRepository);

const ratingController = new RatingController(rateOfferUseCase, listRatingsForUserUseCase);

export const offerRatingRoutes = Router();

offerRatingRoutes.post('/:offerId/ratings', authenticate, ratingController.create);

export const userRatingRoutes = Router();

userRatingRoutes.get('/:userId/ratings', ratingController.listForUser);

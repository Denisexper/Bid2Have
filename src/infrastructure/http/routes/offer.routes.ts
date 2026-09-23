import { Router } from 'express';
import { prisma } from '../../database/prisma-client';
import { PrismaOfferRepository } from '../../database/repositories/PrismaOfferRepository';
import { PrismaListingRepository } from '../../database/repositories/PrismaListingRepository';
import { PrismaChatRepository } from '../../database/repositories/PrismaChatRepository';
import { CreateOfferUseCase } from '../../../application/use-cases/offer/CreateOfferUseCase';
import { ListOffersForListingUseCase } from '../../../application/use-cases/offer/ListOffersForListingUseCase';
import { GetOfferByIdUseCase } from '../../../application/use-cases/offer/GetOfferByIdUseCase';
import { AcceptOfferUseCase } from '../../../application/use-cases/offer/AcceptOfferUseCase';
import { RejectOfferUseCase } from '../../../application/use-cases/offer/RejectOfferUseCase';
import { CounterOfferUseCase } from '../../../application/use-cases/offer/CounterOfferUseCase';
import { OfferController } from '../controllers/offer/OfferController';
import { authenticate } from '../middlewares/authMiddleware';

const offerRepository = new PrismaOfferRepository(prisma);
const listingRepository = new PrismaListingRepository(prisma);
const chatRepository = new PrismaChatRepository(prisma);
const createOfferUseCase = new CreateOfferUseCase(offerRepository, listingRepository);
const listOffersForListingUseCase = new ListOffersForListingUseCase(offerRepository, listingRepository);
const getOfferByIdUseCase = new GetOfferByIdUseCase(offerRepository, listingRepository);
const acceptOfferUseCase = new AcceptOfferUseCase(offerRepository, listingRepository, chatRepository);
const rejectOfferUseCase = new RejectOfferUseCase(offerRepository, listingRepository);
const counterOfferUseCase = new CounterOfferUseCase(offerRepository, listingRepository);

const offerController = new OfferController(
  createOfferUseCase,
  listOffersForListingUseCase,
  getOfferByIdUseCase,
  acceptOfferUseCase,
  rejectOfferUseCase,
  counterOfferUseCase,
);

export const offerRoutes = Router();

offerRoutes.post('/', authenticate, offerController.create);
offerRoutes.get('/:id', authenticate, offerController.getById);
offerRoutes.post('/:id/accept', authenticate, offerController.accept);
offerRoutes.post('/:id/reject', authenticate, offerController.reject);
offerRoutes.post('/:id/counter', authenticate, offerController.counter);

export const listingOfferRoutes = Router();

listingOfferRoutes.get('/:listingId/offers', authenticate, offerController.listForListing);

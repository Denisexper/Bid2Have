import { Router } from 'express';
import { prisma } from '../../database/prisma-client';
import { PrismaListingRepository } from '../../database/repositories/PrismaListingRepository';
import { PrismaCategoryRepository } from '../../database/repositories/PrismaCategoryRepository';
import { CreateListingUseCase } from '../../../application/use-cases/listing/CreateListingUseCase';
import { ListListingsUseCase } from '../../../application/use-cases/listing/ListListingsUseCase';
import { SearchListingsNearbyUseCase } from '../../../application/use-cases/listing/SearchListingsNearbyUseCase';
import { GetListingByIdUseCase } from '../../../application/use-cases/listing/GetListingByIdUseCase';
import { UpdateListingUseCase } from '../../../application/use-cases/listing/UpdateListingUseCase';
import { DeleteListingUseCase } from '../../../application/use-cases/listing/DeleteListingUseCase';
import { ListingController } from '../controllers/listing/ListingController';
import { authenticate } from '../middlewares/authMiddleware';

const listingRepository = new PrismaListingRepository(prisma);
const categoryRepository = new PrismaCategoryRepository(prisma);
const createListingUseCase = new CreateListingUseCase(listingRepository, categoryRepository);
const listListingsUseCase = new ListListingsUseCase(listingRepository);
const searchListingsNearbyUseCase = new SearchListingsNearbyUseCase(listingRepository);
const getListingByIdUseCase = new GetListingByIdUseCase(listingRepository);
const updateListingUseCase = new UpdateListingUseCase(listingRepository, categoryRepository);
const deleteListingUseCase = new DeleteListingUseCase(listingRepository);

const listingController = new ListingController(
  createListingUseCase,
  listListingsUseCase,
  searchListingsNearbyUseCase,
  getListingByIdUseCase,
  updateListingUseCase,
  deleteListingUseCase,
);

export const listingRoutes = Router();

listingRoutes.get('/', listingController.list);
listingRoutes.get('/:id', listingController.getById);
listingRoutes.post('/', authenticate, listingController.create);
listingRoutes.patch('/:id', authenticate, listingController.update);
listingRoutes.delete('/:id', authenticate, listingController.delete);

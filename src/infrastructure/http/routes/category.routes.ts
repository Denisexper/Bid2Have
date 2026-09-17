import { Router } from 'express';
import { prisma } from '../../database/prisma-client';
import { PrismaCategoryRepository } from '../../database/repositories/PrismaCategoryRepository';
import { CreateCategoryUseCase } from '../../../application/use-cases/category/CreateCategoryUseCase';
import { ListCategoriesUseCase } from '../../../application/use-cases/category/ListCategoriesUseCase';
import { GetCategoryByIdUseCase } from '../../../application/use-cases/category/GetCategoryByIdUseCase';
import { UpdateCategoryUseCase } from '../../../application/use-cases/category/UpdateCategoryUseCase';
import { DeleteCategoryUseCase } from '../../../application/use-cases/category/DeleteCategoryUseCase';
import { CategoryController } from '../controllers/category/CategoryController';
import { authenticate } from '../middlewares/authMiddleware';

const categoryRepository = new PrismaCategoryRepository(prisma);
const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
const listCategoriesUseCase = new ListCategoriesUseCase(categoryRepository);
const getCategoryByIdUseCase = new GetCategoryByIdUseCase(categoryRepository);
const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);
const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository);

const categoryController = new CategoryController(
  createCategoryUseCase,
  listCategoriesUseCase,
  getCategoryByIdUseCase,
  updateCategoryUseCase,
  deleteCategoryUseCase,
);

export const categoryRoutes = Router();

categoryRoutes.get('/', categoryController.list);
categoryRoutes.get('/:id', categoryController.getById);
categoryRoutes.post('/', authenticate, categoryController.create);
categoryRoutes.patch('/:id', authenticate, categoryController.update);
categoryRoutes.delete('/:id', authenticate, categoryController.delete);

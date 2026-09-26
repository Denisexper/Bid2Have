import { Request, Response } from 'express';
import { CreateCategoryUseCase } from '../../../../application/use-cases/category/CreateCategoryUseCase';
import { ListCategoriesUseCase } from '../../../../application/use-cases/category/ListCategoriesUseCase';
import { GetCategoryByIdUseCase } from '../../../../application/use-cases/category/GetCategoryByIdUseCase';
import { UpdateCategoryUseCase } from '../../../../application/use-cases/category/UpdateCategoryUseCase';
import { DeleteCategoryUseCase } from '../../../../application/use-cases/category/DeleteCategoryUseCase';
import { CategoryNotFoundError } from '../../../../domain/errors/category/CategoryNotFoundError';
import { CategoryAlreadyExistsError } from '../../../../domain/errors/category/CategoryAlreadyExistsError';

export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly listCategoriesUseCase: ListCategoriesUseCase,
    private readonly getCategoryByIdUseCase: GetCategoryByIdUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
  ) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const { name, slug } = req.body;

    if (!name || typeof name !== 'string' || !slug || typeof slug !== 'string') {
      res.status(400).json({ message: 'name and slug are required' });
      return;
    }

    try {
      const category = await this.createCategoryUseCase.execute({ name, slug });
      res.status(201).json({ category });
    } catch (error) {
      if (error instanceof CategoryAlreadyExistsError) {
        res.status(409).json({ message: error.message });
        return;
      }
      throw error;
    }
  };

  list = async (_req: Request, res: Response): Promise<void> => {
    const categories = await this.listCategoriesUseCase.execute();
    res.status(200).json({ categories });
  };

  getById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const category = await this.getCategoryByIdUseCase.execute(id);
      res.status(200).json({ category });
    } catch (error) {
      if (error instanceof CategoryNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      throw error;
    }
  };

  update = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, slug } = req.body;

    try {
      const category = await this.updateCategoryUseCase.execute(id, { name, slug });
      res.status(200).json({ category });
    } catch (error) {
      if (error instanceof CategoryNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof CategoryAlreadyExistsError) {
        res.status(409).json({ message: error.message });
        return;
      }
      throw error;
    }
  };

  delete = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      await this.deleteCategoryUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof CategoryNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      throw error;
    }
  };
}

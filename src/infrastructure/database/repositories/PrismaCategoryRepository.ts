import { PrismaClient } from '../../../generated/prisma/client';
import { Category } from "../../../domain/entities/Category";
import { CreateCategoryInput, CategoryRepository, UpdateCategoryInput } from "../../../domain/repositories/CategoryRepository";

export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private readonly prisma: PrismaClient) {}

create(input: CreateCategoryInput): Promise<Category> {
        return this.prisma.category.create({ data: input });
    }
findBySlug(slug: string): Promise<Category | null> {
        return this.prisma.category.findUnique({ where: { slug } });
    }
finAll(): Promise<Category[]> {
        return this.prisma.category.findMany();
    }
findById(id: string): Promise<Category | null> {
        return this.prisma.category.findUnique({where: { id } });
    }
async updateById(id: string, input: UpdateCategoryInput): Promise<Category | null> {
        const existing = await this.prisma.category.findUnique({ where: { id } });
        if (!existing) {
            return null;
        }
        return await this.prisma.category.update({ where: { id }, data: input });
    }
async delete(id: string): Promise<Category | null> {
        const existing = await this.prisma.category.findUnique({ where: { id } });
        if (!existing) {
            return null;
        }
        return await this.prisma.category.delete({ where: { id } });
    }

}

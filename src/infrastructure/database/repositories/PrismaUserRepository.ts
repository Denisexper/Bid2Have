import { PrismaClient } from '../../../generated/prisma/client';
import { UserStatus } from '../../../generated/prisma/enums';
import { User } from '../../../domain/entities/User';
import { CreateUserInput, UserRepository } from '../../../domain/repositories/UserRepository';

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { googleId } });
  }

  async create(input: CreateUserInput): Promise<User> {
    return this.prisma.user.create({ data: input });
  }

  async findAll(status?: UserStatus): Promise<User[]> {
    return this.prisma.user.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: UserStatus): Promise<User | null> {
    return this.prisma.user.update({ where: { id }, data: { status } }).catch(() => null);
  }
}

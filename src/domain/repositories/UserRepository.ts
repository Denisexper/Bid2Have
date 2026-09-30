import { User } from '../entities/User';
import { UserStatus } from '../../generated/prisma/enums';

export interface CreateUserInput {
  googleId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByGoogleId(googleId: string): Promise<User | null>;
  create(input: CreateUserInput): Promise<User>;
  findAll(status?: UserStatus): Promise<User[]>;
  updateStatus(id: string, status: UserStatus): Promise<User | null>;
}

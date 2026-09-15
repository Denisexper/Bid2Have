import { User } from '../entities/User';

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
}

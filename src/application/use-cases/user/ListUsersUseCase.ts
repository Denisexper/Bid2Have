import { User } from '../../../domain/entities/User';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { UserStatus } from '../../../generated/prisma/enums';

export class ListUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(status?: UserStatus): Promise<User[]> {
    return this.userRepository.findAll(status);
  }
}

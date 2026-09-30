import { User } from '../../../domain/entities/User';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { UserNotFoundError } from '../../../domain/errors/user/UserNotFoundError';
import { InvalidUserStateError } from '../../../domain/errors/user/InvalidUserStateError';
import { UserStatus } from '../../../generated/prisma/enums';

export class ReactivateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    if (user.status === UserStatus.ACTIVE) {
      throw new InvalidUserStateError('User is already active');
    }

    const updated = await this.userRepository.updateStatus(id, UserStatus.ACTIVE);
    if (!updated) {
      throw new UserNotFoundError(id);
    }

    return updated;
  }
}

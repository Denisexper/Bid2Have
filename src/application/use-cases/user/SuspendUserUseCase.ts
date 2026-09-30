import { User } from '../../../domain/entities/User';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { UserNotFoundError } from '../../../domain/errors/user/UserNotFoundError';
import { InvalidUserStateError } from '../../../domain/errors/user/InvalidUserStateError';
import { CannotSuspendSelfError } from '../../../domain/errors/user/CannotSuspendSelfError';
import { UserStatus } from '../../../generated/prisma/enums';

export class SuspendUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, actingUserId: string): Promise<User> {
    if (id === actingUserId) {
      throw new CannotSuspendSelfError();
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new InvalidUserStateError('User is already suspended');
    }

    const updated = await this.userRepository.updateStatus(id, UserStatus.SUSPENDED);
    if (!updated) {
      throw new UserNotFoundError(id);
    }

    return updated;
  }
}

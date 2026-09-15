import { User } from '../../domain/entities/User';
import { GoogleTokenVerifier } from '../../domain/repositories/GoogleTokenVerifier';
import { UserRepository } from '../../domain/repositories/UserRepository';

export class AuthenticateWithGoogleUseCase {
  constructor(
    private readonly googleTokenVerifier: GoogleTokenVerifier,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(idToken: string): Promise<User> {
    const payload = await this.googleTokenVerifier.verify(idToken);

    const existingUser = await this.userRepository.findByGoogleId(payload.googleId);
    if (existingUser) {
      return existingUser;
    }

    return this.userRepository.create({
      googleId: payload.googleId,
      name: payload.name,
      email: payload.email,
      avatarUrl: payload.avatarUrl,
    });
  }
}

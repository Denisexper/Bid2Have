import { Request, Response } from 'express';
import { InvalidGoogleTokenError } from '../../../domain/errors/auth/InvalidGoogleTokenError';
import { AuthenticateWithGoogleUseCase } from '../../../application/use-cases/AuthenticateWithGoogleUseCase';
import { signJwt } from '../../../shared/utils/jwt';

export class AuthController {
  constructor(private readonly authenticateWithGoogleUseCase: AuthenticateWithGoogleUseCase) {}

  googleLogin = async (req: Request, res: Response): Promise<void> => {
    const { idToken } = req.body;

    if (!idToken || typeof idToken !== 'string') {
      res.status(400).json({ message: 'idToken is required' });
      return;
    }

    try {
      const user = await this.authenticateWithGoogleUseCase.execute(idToken);
      const token = signJwt({ userId: user.id });

      res.status(200).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          role: user.role,
        },
      });
    } catch (error) {
      if (error instanceof InvalidGoogleTokenError) {
        res.status(401).json({ message: error.message });
        return;
      }
      throw error;
    }
  };

  me = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({ user: req.user });
  };
}

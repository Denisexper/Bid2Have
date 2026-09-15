import { Router } from 'express';
import { AuthenticateWithGoogleUseCase } from '../../../application/use-cases/AuthenticateWithGoogleUseCase';
import { env } from '../../config/env';
import { prisma } from '../../database/prisma-client';
import { PrismaUserRepository } from '../../database/repositories/PrismaUserRepository';
import { GoogleAuthTokenVerifier } from '../../auth/GoogleAuthTokenVerifier';
import { AuthController } from '../controllers/AuthController';
import { authenticate } from '../middlewares/authMiddleware';

const userRepository = new PrismaUserRepository(prisma);
const googleTokenVerifier = new GoogleAuthTokenVerifier(env.googleClientId);
const authenticateWithGoogleUseCase = new AuthenticateWithGoogleUseCase(googleTokenVerifier, userRepository);
const authController = new AuthController(authenticateWithGoogleUseCase);

export const authRoutes = Router();

authRoutes.post('/google', authController.googleLogin);
authRoutes.get('/me', authenticate, authController.me);

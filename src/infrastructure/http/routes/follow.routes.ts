import { Router } from 'express';
import { prisma } from '../../database/prisma-client';
import { PrismaFollowRepository } from '../../database/repositories/PrismaFollowRepository';
import { PrismaUserRepository } from '../../database/repositories/PrismaUserRepository';
import { FollowUserUseCase } from '../../../application/use-cases/follow/FollowUserUseCase';
import { UnfollowUserUseCase } from '../../../application/use-cases/follow/UnfollowUserUseCase';
import { ListFollowedSellersUseCase } from '../../../application/use-cases/follow/ListFollowedSellersUseCase';
import { FollowController } from '../controllers/follow/FollowController';
import { authenticate } from '../middlewares/authMiddleware';

const followRepository = new PrismaFollowRepository(prisma);
const userRepository = new PrismaUserRepository(prisma);

const followUserUseCase = new FollowUserUseCase(followRepository, userRepository);
const unfollowUserUseCase = new UnfollowUserUseCase(followRepository);
const listFollowedSellersUseCase = new ListFollowedSellersUseCase(followRepository);

const followController = new FollowController(followUserUseCase, unfollowUserUseCase, listFollowedSellersUseCase);

export const userFollowRoutes = Router();

userFollowRoutes.get('/following', authenticate, followController.listFollowing);
userFollowRoutes.post('/:userId/follow', authenticate, followController.follow);
userFollowRoutes.delete('/:userId/follow', authenticate, followController.unfollow);

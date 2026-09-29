import { Follow } from '../entities/Follow';

export interface CreateFollowInput {
  followerId: string;
  followingId: string;
}

export interface FollowRepository {
  create(input: CreateFollowInput): Promise<Follow>;
  findByFollowerAndFollowing(followerId: string, followingId: string): Promise<Follow | null>;
  findFollowingByFollowerId(followerId: string): Promise<Follow[]>;
  findFollowersByFollowingId(followingId: string): Promise<Follow[]>;
  delete(followerId: string, followingId: string): Promise<void>;
}

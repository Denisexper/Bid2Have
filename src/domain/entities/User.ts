import { UserRole, UserStatus } from '../../generated/prisma/enums';

export interface User {
  id: string;
  googleId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: UserRole;
  status: UserStatus;
  lat: number | null;
  lng: number | null;
  createdAt: Date;
  updatedAt: Date;
}

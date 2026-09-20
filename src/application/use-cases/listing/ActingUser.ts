import { UserRole } from '../../../generated/prisma/enums';

export interface ActingUser {
  id: string;
  role: UserRole;
}

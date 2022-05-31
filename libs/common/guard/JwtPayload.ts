import { UserRole } from '@app/entity/domain/user/UserRole';

export class JwtPayload {
  userId: number;
  role: UserRole;
  iat?: number;
  exp?: number;
}

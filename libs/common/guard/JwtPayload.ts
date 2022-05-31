import { UserRole } from '@app/entity/domain/user/UserRole';

export class JwtPayload {
  userId: number;
  iat?: number;
  exp?: number;
}

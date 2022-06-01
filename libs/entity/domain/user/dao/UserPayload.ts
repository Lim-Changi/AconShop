import { Expose } from 'class-transformer';
import { UserRole } from './UserRole';

export class UserPayload {
  @Expose({ name: 'id' })
  id: number;

  @Expose({ name: 'account' })
  account: string;

  @Expose({ name: 'role' })
  role: UserRole;
}

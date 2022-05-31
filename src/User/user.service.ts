import { User } from '@app/entity/domain/user/User.entity';
import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(user: User): Promise<User> {
    return this.userRepository.createUser(user);
  }

  async setLoggedAt(userId: number, loggedAt: Date): Promise<void> {
    return this.userRepository.updateLoggedAt(userId, loggedAt);
  }

  async getUser(userId: number): Promise<User> {
    return this.userRepository.getUser(userId);
  }

  async getLoginData(accountId: string): Promise<User> {
    return this.userRepository.loginUser(accountId);
  }
}

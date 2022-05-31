import { createQueryBuilder, EntityRepository, Repository } from 'typeorm';
import { User } from '@app/entity/domain/user/User.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(user: User): Promise<User> {
    const insertQuery = await createQueryBuilder()
      .insert()
      .into(User)
      .values(user)
      .execute();
    user.id = insertQuery.raw.insertId;
    return user;
  }

  async updateLoggedAt(userId: number, loggedAt: Date): Promise<void> {
    await createQueryBuilder()
      .update(User)
      .set({ loggedAt })
      .where(`id =:userId`, { userId })
      .execute();
  }

  async getUser(userId: number): Promise<User> {
    const selectQuery = createQueryBuilder()
      .select(['id', 'account', 'role'])
      .from(User, 'user')
      .where(`user.id =:userId`, { userId });

    return await selectQuery.getRawOne();
  }

  async loginUser(accountId: string): Promise<User> {
    const selectQuery = createQueryBuilder()
      .select(['id', 'password'])
      .from(User, 'user')
      .where(`user.account =:accountId`, { accountId });

    return await selectQuery.getRawOne();
  }
}

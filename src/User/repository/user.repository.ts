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

    return insertQuery.raw[0];
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
}

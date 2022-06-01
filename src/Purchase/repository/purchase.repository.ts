import { Purchase } from '@app/entity/domain/purchase/Purchase.entity';
import { createQueryBuilder, EntityRepository, Repository } from 'typeorm';

@EntityRepository(Purchase)
export class PurchaseRepository extends Repository<Purchase> {
  async purchaseProduct(purchase: Purchase): Promise<void> {
    await createQueryBuilder()
      .insert()
      .into(Purchase)
      .values(purchase)
      .execute();
  }
}

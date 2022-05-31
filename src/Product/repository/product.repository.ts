import { Product } from '@app/entity/domain/product/Product.entity';
import { createQueryBuilder, EntityRepository, Repository } from 'typeorm';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  async submitProduct(product: Product): Promise<Product> {
    const insertQuery = await createQueryBuilder()
      .insert()
      .into(Product)
      .values(product)
      .execute();
    product.id = insertQuery.raw.insertId;
    return product;
  }
}

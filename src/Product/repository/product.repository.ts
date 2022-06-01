import { Product } from '@app/entity/domain/product/Product.entity';
import { ProductStatus } from '@app/entity/domain/product/ProductStatusType';
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

  async getPendingProduct(): Promise<Product[]> {
    const selectQuery = await createQueryBuilder()
      .select(['id', 'status', 'title', 'description', 'author_id', 'price'])
      .from(Product, 'product')
      .where(`product.status =:status`, { status: ProductStatus.Pending });

    return selectQuery.getRawMany();
  }
}

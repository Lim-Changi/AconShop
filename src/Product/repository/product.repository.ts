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

  async reviewProduct(product: Product, userId: number): Promise<void> {
    product.Editor = userId.toString();

    await createQueryBuilder()
      .update(Product)
      .set(product)
      .where(`id = :id`, { id: product.id })
      .execute();
  }

  async getProductById(productId: number): Promise<Product> {
    const selectQuery = createQueryBuilder()
      .from(Product, 'product')
      .leftJoin('product.Country', 'country')
      .where(`product.id =:productId`, { productId });
    const result = await selectQuery.getRawOne();
    result.id = productId;
    return result;
  }
}

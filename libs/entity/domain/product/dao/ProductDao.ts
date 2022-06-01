import { Expose } from 'class-transformer';
import { ProductStatus } from '../ProductStatusType';

export class ProductDao {
  @Expose({ name: 'id' })
  id: string;

  @Expose({ name: 'status' })
  status: ProductStatus;

  @Expose({ name: 'title' })
  title: string;

  @Expose({ name: 'description' })
  description: string;

  @Expose({ name: 'authorId' })
  authorId: string;

  @Expose({ name: 'editorId' })
  editorId: string;

  @Expose({ name: 'price' })
  price: number;
}

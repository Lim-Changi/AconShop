import { Expose } from 'class-transformer';
import { ProductStatus } from '../ProductStatusType';

export class ProductJoinCountryDao {
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

  @Expose({ name: 'fee' })
  fee: number;

  @Expose({ name: 'countryId' })
  countryId: number;

  @Expose({ name: 'name' })
  name: string;

  @Expose({ name: 'exchangeRate' })
  exchangeRate: number;

  @Expose({ name: 'currency' })
  currency: string;
}

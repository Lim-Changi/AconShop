import { Expose } from 'class-transformer';
import { CountryDao } from '../country/CountryDao';
import { ProductStatus } from './ProductStatusType';

export class ProductJoinCountryDao {
  @Expose({ name: 'id' })
  id: number;

  @Expose({ name: 'status' })
  status: ProductStatus;

  @Expose({ name: 'title' })
  title: string;

  @Expose({ name: 'description' })
  description: string;

  @Expose({ name: 'authorId' })
  Author: string;

  @Expose({ name: 'editorId' })
  editorId: number;

  @Expose({ name: 'price' })
  price: number;

  @Expose({ name: 'country' })
  Country: CountryDao;
}
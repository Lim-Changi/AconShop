import { Expose } from 'class-transformer';
import { CountryDao } from '../../country/dao/CountryDao';
import { ProductStatus } from '../ProductStatusType';

export class ProductSubmitDao {
  @Expose({ name: 'id' })
  id: string;

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

  @Expose({ name: 'fee' })
  fee: number;

  @Expose({ name: 'country' })
  Country: CountryDao;
}

import { Expose } from 'class-transformer';

export class CountryPagination {
  @Expose({ name: 'id' })
  id: number;

  @Expose({ name: 'name' })
  name: string;

  @Expose({ name: 'exchange_rate' })
  exchangeRate: number;

  @Expose({ name: 'currency' })
  currency: string;
}

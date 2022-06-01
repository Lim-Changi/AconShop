import { Expose } from 'class-transformer';

export class CountryDao {
  @Expose({ name: 'id' })
  id: string;

  @Expose({ name: 'name' })
  name: string;

  @Expose({ name: 'exchange_rate' })
  exchangeRate: number;

  @Expose({ name: 'currency' })
  currency: string;
}

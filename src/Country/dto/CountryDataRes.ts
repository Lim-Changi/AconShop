import { CountryDao } from '@app/entity/domain/country/CountryDao';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class CountryDataRes {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _name: string;
  @Exclude() private readonly _exchangeRate: number;
  @Exclude() private readonly _currency: string;

  constructor(country: CountryDao) {
    this._id = country.id;
    this._name = country.name;
    this._exchangeRate = country.exchangeRate;
    this._currency = country.currency;
  }

  @ApiProperty()
  @Expose()
  get id(): number {
    return this._id;
  }

  @ApiProperty()
  @Expose()
  get name(): string {
    return this._name;
  }

  @ApiProperty()
  @Expose()
  get exchange_rate(): number {
    return this._exchangeRate;
  }

  @ApiProperty()
  @Expose()
  get currency(): string {
    return this._currency;
  }
}

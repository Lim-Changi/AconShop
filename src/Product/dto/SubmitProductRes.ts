import { ProductJoinCountryDao } from '@app/entity/domain/product/ProductJoinCountryDao';
import { ProductStatus } from '@app/entity/domain/product/ProductStatusType';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class SubmitProductRes {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _status: ProductStatus;
  @Exclude() private readonly _title: string;
  @Exclude() private readonly _description: string;
  @Exclude() private readonly _authorId: number;
  @Exclude() private readonly _price: number;
  @Exclude() private readonly _country: string;
  @Exclude() private readonly _exchangeRate: number;
  @Exclude() private readonly _currency: string;

  constructor(productJoinCountryDao: ProductJoinCountryDao) {
    this._id = productJoinCountryDao.id;
    this._status = productJoinCountryDao.status;
    this._title = productJoinCountryDao.title;
    this._description = productJoinCountryDao.description;
    this._authorId = Number(productJoinCountryDao.Author);
    this._price = productJoinCountryDao.price;
    this._country = productJoinCountryDao.Country.name;
    this._exchangeRate = productJoinCountryDao.Country.exchangeRate;
    this._currency = productJoinCountryDao.Country.currency;
  }

  @ApiProperty()
  @Expose()
  get id(): number {
    return this._id;
  }

  @ApiProperty()
  @Expose()
  get status(): ProductStatus {
    return this._status;
  }

  @ApiProperty()
  @Expose()
  get title(): string {
    return this._title;
  }

  @ApiProperty()
  @Expose()
  get description(): string {
    return this._description;
  }

  @ApiProperty()
  @Expose()
  get author_id(): number {
    return this._authorId;
  }

  @ApiProperty()
  @Expose()
  get price(): number {
    return this._price;
  }

  @ApiProperty()
  @Expose()
  get country(): string {
    return this._country;
  }

  @ApiProperty()
  @Expose()
  get currency(): string {
    return this._currency;
  }

  @ApiProperty()
  @Expose()
  get exchange_rate(): number {
    return this._exchangeRate;
  }
}

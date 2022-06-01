import { ProductJoinCountryDao } from '@app/entity/domain/product/dao/ProductJoinCountryDao';
import { ProductStatus } from '@app/entity/domain/product/ProductStatusType';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class ProductDataRes {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _status: ProductStatus;
  @Exclude() private readonly _title: string;
  @Exclude() private readonly _description: string;
  @Exclude() private readonly _authorId: number;
  @Exclude() private readonly _editorId: number;
  @Exclude() private readonly _price: number;
  @Exclude() private readonly _fee: number;
  @Exclude() private readonly _countryId: number;
  @Exclude() private readonly _name: string;
  @Exclude() private readonly _exchangeRate: number;
  @Exclude() private readonly _currency: string;

  constructor(ProductJoinCountryDao: ProductJoinCountryDao) {
    this._id = Number(ProductJoinCountryDao.id);
    this._status = ProductJoinCountryDao.status;
    this._title = ProductJoinCountryDao.title;
    this._description = ProductJoinCountryDao.description;
    this._authorId = Number(ProductJoinCountryDao.authorId);
    this._editorId = Number(ProductJoinCountryDao.editorId);
    this._price = ProductJoinCountryDao.price;
    this._fee = ProductJoinCountryDao.fee;
    this._countryId = Number(ProductJoinCountryDao.countryId);
    this._name = ProductJoinCountryDao.name;
    this._exchangeRate = ProductJoinCountryDao.exchangeRate;
    this._currency = ProductJoinCountryDao.currency;
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
  get editor_id(): number {
    return this._editorId;
  }

  @ApiProperty()
  @Expose()
  get price(): number {
    return this._price;
  }

  @ApiProperty()
  @Expose()
  get fee(): number {
    return this._fee;
  }

  @ApiProperty()
  @Expose()
  get country_id(): number {
    return this._countryId;
  }

  @ApiProperty()
  @Expose()
  get name(): string {
    return this._name;
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

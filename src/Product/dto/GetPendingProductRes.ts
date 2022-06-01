import { ProductDao } from '@app/entity/domain/product/dao/ProductDao';
import { ProductStatus } from '@app/entity/domain/product/ProductStatusType';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class GetPendingProductRes {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _status: ProductStatus;
  @Exclude() private readonly _title: string;
  @Exclude() private readonly _description: string;
  @Exclude() private readonly _authorId: number;
  @Exclude() private readonly _price: number;

  constructor(productDao: ProductDao) {
    this._id = Number(productDao.id);
    this._status = productDao.status;
    this._title = productDao.title;
    this._description = productDao.description;
    this._authorId = Number(productDao.authorId);
    this._price = productDao.price;
  }

  @ApiProperty()
  @Expose()
  get id(): number {
    return this._id;
  }

  @ApiProperty()
  @Expose()
  get title(): string {
    return this._title;
  }

  @ApiProperty()
  @Expose()
  get status(): ProductStatus {
    return this._status;
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
}

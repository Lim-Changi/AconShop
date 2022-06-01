import { Product } from '@app/entity/domain/product/Product.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddForiegnProductReq {
  @ApiProperty({
    example: 6,
    description: '타 국가 상품 정보를 추가할 기준 상품ID 입니다.',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  product_id: number;

  @ApiProperty({
    example: 2,
    description: '타 국가ID 입니다.',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  country_id: number;

  @ApiProperty({
    example: 'Title',
    description: '상품의 외국어 제목입니다.',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Description',
    description: '상품의 외국어 본문입니다.',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  @IsString()
  description: string;

  toEntity(): Product {
    return Product.addForeign(
      this.product_id,
      this.country_id,
      this.title,
      this.description,
    );
  }
}

import { Product } from '@app/entity/domain/product/Product.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SubmitProductReq {
  @ApiProperty({
    example: '제목',
    description: '상품의 제목입니다.',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: '본문',
    description: '상품의 본문입니다.',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: '100000',
    description: '상품의 가격입니다. (국가별 환율과 통화에 따라 다름)',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  price: number;

  toEntity(): Product {
    return Product.submit(this.title, this.description, this.price);
  }
}

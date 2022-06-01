import { Product } from '@app/entity/domain/product/Product.entity';
import { ProductStatus } from '@app/entity/domain/product/ProductStatusType';
import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ReviewProductReq {
  @ApiProperty({
    example: 6,
    description: '수정할 상품의 ID 입니다.',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  product_id: number;

  @ApiProperty({
    example: '제목 수정',
    description: '수정할 상품의 제목입니다.',
  })
  @Expose()
  title: string;

  @ApiProperty({
    example: '본문 수정',
    description: '수정할 상품의 본문입니다.',
  })
  @Expose()
  description: string;

  @ApiProperty({
    example: '80000',
    description: '수정할 상품의 가격입니다. (대한민국 원화 기준)',
    required: true,
  })
  @Expose()
  price: number;

  @ApiProperty({
    example: '0.15',
    description: '책정 할 상품의 수루료 %입니다.',
    required: true,
  })
  @Expose()
  fee: number;

  @ApiProperty({
    enum: ProductStatus,
    example: ProductStatus.Success,
    description: '상품의 검토 상태입니다. 1=Success, 2=Fail, 3=Pending.',
  })
  @Expose()
  status: ProductStatus;

  toEntity(): Product {
    if (this.status === ProductStatus.Success && !this.fee)
      throw new BadRequestException(
        '상품 검토를 완수하려면 수수료를 입력해야합니다.',
      );
    return Product.review(
      this.product_id,
      this.title,
      this.description,
      this.price,
      this.fee,
      this.status,
    );
  }
}

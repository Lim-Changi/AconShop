import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Purchase } from '@app/entity/domain/purchase/Purchase.entity';

export class PurchaseProductReq {
  @ApiProperty({
    example: 1,
    description: '상품 구매시, 입력받는 상품 ID 입니다.',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  product_id: number;

  toEntity(): Purchase {
    return Purchase.create(this.product_id);
  }
}

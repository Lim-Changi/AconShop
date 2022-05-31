import { ApiExtraModels, ApiProperty, PickType } from '@nestjs/swagger';
import { CreatedSuccess } from '@app/common/response/swagger/common/CreatedSuccess';
import { ProductStatus } from '@app/entity/domain/product/ProductStatusType';
import { SubmitProductRes } from '../../../../../../src/Product/dto/SubmitProductRes';

@ApiExtraModels()
export class SubmitProductSuccess extends PickType(CreatedSuccess, [
  'statusCode',
] as const) {
  @ApiProperty({
    type: 'string',
    title: '성공 응답 값',
    description: '상품 제출 후 나오는 메시지입니다.',
    example: '상품 제출에 성공했습니다.',
  })
  message: string;

  @ApiProperty({
    type: SubmitProductRes,
    title: '성공 데이터',
    example: {
      id: 5,
      status: ProductStatus.Pending,
      title: '제목',
      description: '본문',
      author_id: 7,
      price: 100000,
      country: '대한민국',
      exchange_rate: 1,
      currency: '₩',
    },
    description: '상품 제출에 성공했습니다.',
  })
  data: SubmitProductRes;
}

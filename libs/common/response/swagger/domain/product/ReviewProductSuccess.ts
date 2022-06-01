import { ApiExtraModels, ApiProperty, PickType } from '@nestjs/swagger';
import { ProductDataRes } from 'src/Product/dto/ProductDataRes';
import { CreatedSuccess } from '../../common/CreatedSuccess';

@ApiExtraModels()
export class ReviewProductSuccess extends PickType(CreatedSuccess, [
  'statusCode',
] as const) {
  @ApiProperty({
    type: 'string',
    title: '성공 응답 값',
    description: '상품 검토 및 수정 후 나오는 메시지입니다.',
    example: '상품 검토 및 수정에 성공했습니다.',
  })
  message: string;

  @ApiProperty({
    type: ProductDataRes,
    title: '성공 데이터',
    example: {
      id: 6,
      status: 1,
      title: '제목 수정',
      description: '본문 수정',
      author_id: 26,
      editor_id: 24,
      price: '80000.00',
      fee: '0.15',
      country_id: 1,
      name: '대한민국',
      currency: '₩',
      exchange_rate: '1.00000',
    },
    description: '상품 검토 및 수정에 성공했습니다.',
  })
  data: ProductDataRes;
}

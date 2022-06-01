import { ApiExtraModels, ApiProperty, PickType } from '@nestjs/swagger';
import { ProductDataRes } from 'src/Product/dto/ProductDataRes';
import { CreatedSuccess } from '../../common/CreatedSuccess';

@ApiExtraModels()
export class AddForeignProductSuccess extends PickType(CreatedSuccess, [
  'statusCode',
] as const) {
  @ApiProperty({
    type: 'string',
    title: '성공 응답 값',
    description: '상품 타 국가정보 추가 후 나오는 메시지입니다.',
    example: '상품 타 국가정보 추가에 성공했습니다.',
  })
  message: string;

  @ApiProperty({
    type: ProductDataRes,
    title: '성공 데이터',
    example: {
      id: 6,
      status: 1,
      title: 'Title',
      description: 'Description',
      author_id: 26,
      editor_id: 24,
      price: '12.25',
      fee: '0.15',
      country_id: 2,
      name: '미국',
      currency: '$',
      exchange_rate: '0.00081',
    },
    description: '상품 타 국가정보 추가에 성공했습니다.',
  })
  data: ProductDataRes;
}

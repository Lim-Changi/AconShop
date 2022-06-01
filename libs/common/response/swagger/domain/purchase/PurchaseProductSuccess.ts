import { ApiExtraModels, ApiProperty, PickType } from '@nestjs/swagger';
import { CreatedSuccess } from '@app/common/response/swagger/common/CreatedSuccess';

@ApiExtraModels()
export class PurchaseProductSuccess extends PickType(CreatedSuccess, [
  'statusCode',
  'data',
] as const) {
  @ApiProperty({
    type: 'string',
    title: '성공 응답 값',
    description: '상품 구매 후 나오는 메시지입니다.',
    example: '상품 구매에 성공했습니다.',
  })
  message: string;
}

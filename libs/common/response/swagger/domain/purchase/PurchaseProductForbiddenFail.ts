import { ApiExtraModels, ApiProperty, PickType } from '@nestjs/swagger';
import { ForbiddenError } from '../../common/error/ForbiddenError';

@ApiExtraModels()
export class PurchaseProductForbiddenFail extends PickType(ForbiddenError, [
  'statusCode',
] as const) {
  @ApiProperty({
    type: 'string',
    title: 'Error 메시지',
    example: '잘못된 상품입니다.',
    description: '검수가 완료되지 않았거나 존재하지 않는 상품입니다.',
  })
  message: string;
}

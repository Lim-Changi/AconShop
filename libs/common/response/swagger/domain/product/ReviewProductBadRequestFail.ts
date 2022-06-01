import { ApiExtraModels, ApiProperty, PickType } from '@nestjs/swagger';
import { BadRequestError } from '../../common/error/BadRequestError';

@ApiExtraModels()
export class ReviewProductBadRquestFail extends PickType(BadRequestError, [
  'statusCode',
] as const) {
  @ApiProperty({
    type: 'string',
    title: 'BadRequest Error 메시지',
    example: '상품 검토를 완수하려면 수수료를 입력해야합니다.',
  })
  message: string;
}

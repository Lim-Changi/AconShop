import { ApiExtraModels, ApiProperty, PickType } from '@nestjs/swagger';
import { BadRequestError } from '../../common/error/BadRequestError';

@ApiExtraModels()
export class AddForeignProductBadRquestFail extends PickType(BadRequestError, [
  'statusCode',
] as const) {
  @ApiProperty({
    type: 'string',
    title: 'BadRequest Error 메시지',
    example: '올바르지 않은 요청 값입니다.',
  })
  message: string;
}

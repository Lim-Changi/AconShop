import { ApiExtraModels, ApiProperty, PickType } from '@nestjs/swagger';
import { ForbiddenError } from '../../common/error/ForbiddenError';

@ApiExtraModels()
export class AddCountryForbiddenFail extends PickType(ForbiddenError, [
  'statusCode',
] as const) {
  @ApiProperty({
    type: 'string',
    title: 'Forbidden Error 메시지',
    example: '중복된 국가입니다.',
    description: '중복된 국가 실패',
  })
  message: string;
}

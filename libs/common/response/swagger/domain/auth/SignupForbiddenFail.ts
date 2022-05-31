import { ApiExtraModels, ApiProperty, PickType } from '@nestjs/swagger';
import { ForbiddenError } from '../../common/error/ForbiddenError';

@ApiExtraModels()
export class SignupForbiddenFail extends PickType(ForbiddenError, [
  'statusCode',
] as const) {
  @ApiProperty({
    type: 'string',
    title: 'Forbidden Error 메시지',
    example: '중복된 계정입니다',
    description: '중복된 계정으로 회원 가입을 시도하였습니다.',
  })
  message: string;
}

import { ApiExtraModels, ApiProperty, PickType } from '@nestjs/swagger';
import { ForbiddenError } from '../../common/error/ForbiddenError';

@ApiExtraModels()
export class LoginForbiddenFail extends PickType(ForbiddenError, [
  'statusCode',
  'data',
] as const) {
  @ApiProperty({
    type: 'string',
    title: 'Error 메시지',
    example: 'Login Fail',
    description: '아이디 및 비밀번호 오류입니다.',
  })
  message: string;
}

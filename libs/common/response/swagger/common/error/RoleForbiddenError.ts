import { ApiExtraModels, ApiProperty, PickType } from '@nestjs/swagger';
import { ForbiddenError } from '../../common/error/ForbiddenError';

@ApiExtraModels()
export class RoleForbiddenFail extends PickType(ForbiddenError, [
  'statusCode',
] as const) {
  @ApiProperty({
    type: 'string',
    title: '유저 API 접근 권한 에러',
    example: 'API 접근 권한이 없습니다.',
  })
  message: string;
}

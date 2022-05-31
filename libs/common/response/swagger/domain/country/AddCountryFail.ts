import { InternalServerError } from '@app/common/response/swagger/common/error/InternalServerError';
import { ApiExtraModels, ApiProperty, PickType } from '@nestjs/swagger';

@ApiExtraModels()
export class AddCountryFail extends PickType(InternalServerError, [
  'statusCode',
] as const) {
  @ApiProperty({
    type: 'string',
    title: 'Error 메시지',
    example: '나라 추가에 실패했습니다.',
    description: '나라 추가 로직이 실패했습니다.',
  })
  message: string;
}

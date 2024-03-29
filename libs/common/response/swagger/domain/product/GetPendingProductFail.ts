import { InternalServerError } from '@app/common/response/swagger/common/error/InternalServerError';
import { ApiExtraModels, ApiProperty, PickType } from '@nestjs/swagger';

@ApiExtraModels()
export class GetPendingProductFail extends PickType(InternalServerError, [
  'statusCode',
] as const) {
  @ApiProperty({
    type: 'string',
    title: 'Error 메시지',
    example: '검토 대기 상품 확인에 실패했습니다.',
    description: '검토 대기 상품 확인 로직이 실패했습니다.',
  })
  message: string;
}

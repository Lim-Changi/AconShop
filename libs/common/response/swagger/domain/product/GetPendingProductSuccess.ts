import { ApiExtraModels, ApiProperty, PickType } from '@nestjs/swagger';
import { GetPendingProductRes } from '../../../../../../src/Product/dto/GetPendingProductRes';
import { OkSuccess } from '../../common/OkSuccess';

@ApiExtraModels()
export class GetPendingProductSuccess extends PickType(OkSuccess, [
  'statusCode',
] as const) {
  @ApiProperty({
    type: 'string',
    title: '성공 응답 값',
    description: '검토 대기 상품 확인 후 나오는 메시지입니다.',
    example: '검토 대기 상품 확인에 성공했습니다.',
  })
  message: string;

  @ApiProperty({
    type: GetPendingProductRes,
    title: '성공 데이터',
    example: [
      {
        id: 1,
        title: '제목',
        status: 3,
        description: '본문',
        author_id: 26,
        price: '100000.00',
      },
      {
        id: 10,
        title: '제목5123',
        status: 3,
        description: '본문asd',
        author_id: 26,
        price: '1230.00',
      },
    ],
    description: '검토 대기 상품 확인에 성공했습니다.',
  })
  data: GetPendingProductRes[];
}

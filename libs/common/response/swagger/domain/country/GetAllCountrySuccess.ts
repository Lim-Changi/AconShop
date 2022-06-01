import { ApiExtraModels, ApiProperty, PickType } from '@nestjs/swagger';
import { CountryDataRes } from '../../../../../../src/Country/dto/CountryDataRes';
import { OkSuccess } from '../../common/OkSuccess';

@ApiExtraModels()
export class GetAllCountrySuccess extends PickType(OkSuccess, [
  'statusCode',
] as const) {
  @ApiProperty({
    type: 'string',
    title: '성공 응답 값',
    description: '전체 나라 조회 후 나오는 메시지입니다.',
    example: '전체 나라 조회에 성공했습니다.',
  })
  message: string;

  @ApiProperty({
    type: CountryDataRes,
    title: '성공 데이터',
    example: [
      {
        id: 1,
        name: '대한민국',
        exchange_rate: 1,
        currency: '₩',
      },
      {
        id: 2,
        name: '미국',
        exchange_rate: 0.00081,
        currency: '$',
      },
    ],
    description: '전체 나라 조회에 성공했습니다.',
  })
  data: CountryDataRes[];
}

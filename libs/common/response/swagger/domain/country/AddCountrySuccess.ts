import { ApiExtraModels, ApiProperty, PickType } from '@nestjs/swagger';
import { CreatedSuccess } from '@app/common/response/swagger/common/CreatedSuccess';
import { CountryDataRes } from 'src/Country/dto/CountryDataRes';

@ApiExtraModels()
export class AddCountrySuccess extends PickType(CreatedSuccess, [
  'statusCode',
] as const) {
  @ApiProperty({
    type: 'string',
    title: '성공 응답 값',
    description: '나라 추가 후 나오는 메시지입니다.',
    example: '나라 추가에 성공했습니다.',
  })
  message: string;

  @ApiProperty({
    type: CountryDataRes,
    title: '성공 데이터',
    example: {
      id: 1,
      name: '대한민국',
      exchange_rate: 1,
      currency: '₩',
    },
    description: '나라 추가에 성공했습니다.',
  })
  data: CountryDataRes;
}

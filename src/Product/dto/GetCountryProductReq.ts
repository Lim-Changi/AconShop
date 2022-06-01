import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class GetCountryProductReq {
  @ApiProperty({
    example: 14,
    description: '국가ID 입니다.',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  country_id: string;
}

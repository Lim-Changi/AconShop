import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Country } from '@app/entity/domain/country/Country.entity';

export class AddCountryReq {
  @ApiProperty({
    example: '대한민국',
    description: '국가 추가시, 입력 받는 이름입니다.',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: '1',
    description: '각 나라별 환을입니다. 기준은 대한민국(원) 입니다.',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  exchangeRate: number;

  @ApiProperty({
    example: '₩',
    description: '각 나라별 통화입니다.',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  @IsString()
  currency: string;

  toEntity(): Country {
    return Country.add(this.name, this.exchangeRate, this.currency);
  }
}
